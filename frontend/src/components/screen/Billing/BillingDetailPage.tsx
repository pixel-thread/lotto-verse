import React, { useState } from 'react';
import { ScrollView, Share, Alert } from 'react-native';
import { YStack, XStack, Text, Button, Card, H2, Spinner, Circle, Separator } from 'tamagui';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import http from '@/src/utils/http';
import { BILLING_ENDPOINTS } from '@/src/lib/endpoints/billing';
import { CustomHeader } from '../../common/CustomHeader';
import { formatDate } from '@/src/utils/helper/formatDate';
import { formatMonthWithTime } from '@/src/utils/helper/formatMonth';
import { EmptyCard } from '../../common/EmptyCard';
import { LuckyNumbersT } from '@/src/types/lucky-number';
import { DrawT } from '@/src/types/draw';

type BillingDetailScreenProps = { id: string };

export type BillingDetailT = {
  // Purchase Information
  purchase: {
    id: string;
    createdAt: Date;
    userId: string;
    drawId: string;
    status: string;
    amount: number;
  };

  // Payment Information
  payment: {
    paymentId: string | null;
    razorpayId: string;
    transactionId: string | null;
    method: string;
    status: string;
    currency: string;
    amount: number;
    fee: number;
    tax: number;
    paidAt: Date;
  };

  // User Information
  user: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
  };

  // Draw Information
  draw: DrawT;

  // Lucky Numbers
  luckyNumbers: LuckyNumbersT[];

  // Winner Information (if applicable)
  winner?: {
    id: string;
    name: string;
    winningNumber: number;
    prizeAmount: number;
    declaredAt: Date;
  } | null;
};

export function BillingDetailScreen({ id }: BillingDetailScreenProps) {
  const router = useRouter();
  const [isSharing, setIsSharing] = useState(false);

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['billing-detail', id],
    queryFn: () =>
      http.get<BillingDetailT>(BILLING_ENDPOINTS.GET_BILLING_DETAIL.replace(':id', id)),
    select: (data) => data.data,
    enabled: !!id,
  });

  const handleShare = async () => {
    if (!data) return;

    try {
      setIsSharing(true);
      const message = `
🎫 Lucky Draw Purchase Receipt

Purchase ID: ${data.purchase.id}
Date: ${formatDate(data.purchase.createdAt)}

Lucky Numbers: ${data.luckyNumbers.map((n) => n.number).join(', ')}
Amount Paid: ${data.payment.currency}${data.payment.amount}

Draw: ${new Date(data.draw.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
Prize: ${data.payment.currency}${data.draw.prize.amount}

${data.winner ? `🎉 WINNER! You won ${data.payment.currency}${data.winner.prizeAmount}` : ''}

Transaction ID: ${data.payment.transactionId}
      `.trim();

      await Share.share({
        message,
        title: 'Purchase Receipt',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleDownload = () => {
    Alert.alert('Download Receipt', 'Receipt will be downloaded as PDF', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Download', onPress: () => console.log('Download PDF') },
    ]);
  };

  if (isFetching && !data) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Billing Details',
            headerShown: true,
            header: ({ back }) => <CustomHeader back={!!back} />,
          }}
        />
        <YStack flex={1} justify="center" items="center">
          <Spinner size="large" />
        </YStack>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <EmptyCard
          title="Billing Details"
          message="Billing details not found"
          onRefresh={() => refetch()}
        />
      </>
    );
  }

  const hasWinner = data.winner && data.luckyNumbers.some((n) => n.winnerId);
  const entryFee = data?.draw?.entryFee || 0;
  const breakDownAmount = data?.luckyNumbers?.length * entryFee;
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Billing Details',
          headerShown: true,
          header: ({ back }) => <CustomHeader back={!!back} />,
        }}
      />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 50 }}>
        <YStack gap="$5" maxW={600} self="center" width="100%">
          {/* Winner Banner */}
          {hasWinner && data.winner && (
            <Card
              padding="$5"
              borderRadius="$8"
              backgroundColor="$green3"
              borderWidth={2}
              borderColor="$green10"
              animation="quick"
              enterStyle={{ opacity: 0, scale: 0.9 }}
              exitStyle={{ opacity: 0, scale: 0.9 }}>
              <YStack items="center" gap="$3">
                <Circle size={80} bg="$green10">
                  <Ionicons name="trophy" size={48} color="white" />
                </Circle>
                <Text fontSize={28} fontWeight="900" color="$green10" text="center">
                  🎉 Congratulations! 🎉
                </Text>
                <Text fontSize={18} fontWeight="700" text="center">
                  You Won the Lucky Draw!
                </Text>
                <Text fontSize={48} fontWeight="900" color="$green10">
                  {data.payment.currency}
                  {data.winner.prizeAmount.toLocaleString()}
                </Text>
                <Text fontSize={14} color="$green11" text="center">
                  Winning Number: {data.winner.winningNumber}
                </Text>
                <Text fontSize={12} color="gray" text="center">
                  Declared on {formatDate(data.winner.declaredAt)}
                </Text>
              </YStack>
            </Card>
          )}

          {/* Header */}
          <Card padding="$5" borderRadius="$8" borderWidth={1} borderColor="$borderColor">
            <YStack gap="$3" items="center">
              <Circle size={64} bg="$blue5">
                <Ionicons name="receipt-outline" size={32} color="#3b82f6" />
              </Circle>
              <H2 fontSize={24} fontWeight="900">
                Purchase Receipt
              </H2>
              <Text fontSize={12} color="gray">
                #{data.purchase.id.slice(-12)}
              </Text>
              <XStack items="center" gap="$2">
                <Circle
                  size={10}
                  bg={data.purchase.status === 'SUCCESS' ? '$green10' : '$yellow10'}
                />
                <Text fontSize={14} fontWeight="700" color="$green10">
                  {data.purchase.status}
                </Text>
              </XStack>
            </YStack>
          </Card>

          {/* Amount Summary */}
          <Card
            padding="$5"
            borderRadius="$8"
            backgroundColor="$blue2"
            borderWidth={2}
            borderColor="$blue8">
            <YStack items="center" gap="$2">
              <Text fontSize={14} color="gray" textTransform="uppercase" fontWeight="600">
                Total Amount Paid
              </Text>
              <Text fontSize={56} fontWeight="900" color="$blue10">
                {data.payment.currency}
                {data.payment.amount}
              </Text>
              <XStack items="center" gap="$2">
                <Ionicons name="card-outline" size={16} color="#3b82f6" />
                <Text fontSize={14} color="$blue11" fontWeight="600">
                  Paid via {data.payment.method.toUpperCase()}
                </Text>
              </XStack>
              <Text fontSize={12} color="gray">
                {formatDate(data.payment.paidAt)}
              </Text>
            </YStack>
          </Card>

          {/* Lucky Numbers */}
          <Card padding="$5" borderRadius="$8" borderWidth={1} borderColor="$borderColor">
            <YStack gap="$4">
              <YStack gap="$2" justify="center" items="center">
                <Text fontSize={18} fontWeight="700">
                  Lucky Numbers ({data.luckyNumbers.length})
                </Text>
                <Text fontSize={14} color="gray">
                  Draw: {formatMonthWithTime(new Date(data.draw.month).toString() || '')}
                </Text>
              </YStack>

              <XStack flexWrap="wrap" items={'center'} justify={'center'} gap="$3">
                {data.luckyNumbers.map((num) => (
                  <Card
                    key={num.id}
                    padding="$4"
                    paddingHorizontal="$5"
                    borderRadius="$6"
                    backgroundColor={num.winnerId ? '$green10' : '$blue6'}
                    borderWidth={num.winnerId ? 3 : 2}
                    borderColor={num.winnerId ? '$green8' : '$blue8'}
                    minWidth={90}
                    items="center">
                    <XStack items="center" gap="$2">
                      <Text fontSize={32} fontWeight="900" color="white">
                        {num.number}
                      </Text>
                      {num.winnerId && <Ionicons name="trophy" size={24} color="white" />}
                    </XStack>
                  </Card>
                ))}
              </XStack>
            </YStack>
          </Card>

          {/* Draw Information */}
          <Card padding="$5" borderRadius="$8" borderWidth={1} borderColor="$borderColor">
            <YStack gap="$4">
              <Text fontSize={18} fontWeight="700">
                Draw Information
              </Text>

              <YStack gap="$3">
                <XStack justify="space-between">
                  <Text fontSize={14} color="gray">
                    Draw Month
                  </Text>
                  <Text fontSize={14} fontWeight="600">
                    {new Date(data.draw.month).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </Text>
                </XStack>

                <XStack justify="space-between">
                  <Text fontSize={14} color="gray">
                    Prize Amount
                  </Text>
                  <Text fontSize={14} fontWeight="700" color="$green10">
                    {data.payment.currency}
                    {data.draw.prize.amount.toLocaleString()}
                  </Text>
                </XStack>

                <XStack justify="space-between">
                  <Text fontSize={14} color="gray">
                    Number Range
                  </Text>
                  <Text fontSize={14} fontWeight="600">
                    {data.draw.startRange} - {data.draw.endRange}
                  </Text>
                </XStack>

                <XStack justify="space-between">
                  <Text fontSize={14} color="gray">
                    Draw Date
                  </Text>
                  <Text fontSize={14} fontWeight="600">
                    {formatMonthWithTime(data.draw.endDate.toString())}
                  </Text>
                </XStack>

                <XStack justify="space-between">
                  <Text fontSize={14} color="gray">
                    Winner Status
                  </Text>
                  <Text
                    fontSize={14}
                    fontWeight="700"
                    color={data.draw.isWinnerDecleared ? '$green10' : '$yellow10'}>
                    {data.draw.isWinnerDecleared ? 'Declared' : 'Pending'}
                  </Text>
                </XStack>
              </YStack>
            </YStack>
          </Card>

          {/* Billing Breakdown */}
          <Card padding="$5" borderRadius="$8" borderWidth={1} borderColor="$borderColor">
            <YStack gap="$4">
              <Text fontSize={18} fontWeight="700">
                Billing Breakdown
              </Text>

              <YStack gap="$3">
                <XStack justify="space-between">
                  <Text fontSize={14} color="gray">
                    Entry Fee ({data.luckyNumbers.length} × {data.payment.currency}
                    {` `}
                    {data.draw.entryFee})
                  </Text>
                  <Text fontSize={14} fontWeight="600">
                    {data.payment.currency}
                    {` `}
                    {breakDownAmount}
                  </Text>
                </XStack>

                {data.payment.fee > 0 && (
                  <XStack justify="space-between">
                    <Text fontSize={14} color="gray">
                      Payment Gateway Fee
                    </Text>
                    <Text fontSize={14} fontWeight="600">
                      {data.payment.currency}
                      {` `}
                      {data.payment.fee}
                    </Text>
                  </XStack>
                )}

                {data.payment.tax > 0 && (
                  <XStack justify="space-between">
                    <Text fontSize={14} color="gray">
                      Tax & GST
                    </Text>
                    <Text fontSize={14} fontWeight="600">
                      {data.payment.currency}
                      {` `}
                      {data.payment.tax}
                    </Text>
                  </XStack>
                )}

                <Separator borderColor="$borderColor" marginBlock="$2" />

                <XStack justify="space-between">
                  <Text fontSize={16} fontWeight="700">
                    Total Amount
                  </Text>
                  <Text fontSize={20} fontWeight="900" color="$green10">
                    {data.payment.currency}
                    {data.payment.amount}
                  </Text>
                </XStack>
              </YStack>
            </YStack>
          </Card>

          {/* Payment Details */}
          <Card padding="$5" borderRadius="$8" borderWidth={1} borderColor="$borderColor">
            <YStack gap="$4">
              <XStack items="center" gap="$2">
                <Ionicons name="card-outline" size={20} color="gray" />
                <Text fontSize={18} fontWeight="700">
                  Payment Details
                </Text>
              </XStack>

              <YStack gap="$3">
                <YStack gap="$2">
                  <Text fontSize={12} color="gray" textTransform="uppercase">
                    Payment ID
                  </Text>
                  <Text fontSize={14} fontWeight="600">
                    {data.payment.paymentId}
                  </Text>
                </YStack>

                <YStack gap="$2">
                  <Text fontSize={12} color="gray" textTransform="uppercase">
                    Razorpay ID
                  </Text>
                  <Text fontSize={14} fontWeight="600">
                    {data.payment.razorpayId}
                  </Text>
                </YStack>

                <YStack gap="$2">
                  <Text fontSize={12} color="gray" textTransform="uppercase">
                    Transaction ID
                  </Text>
                  <Text fontSize={14} fontWeight="600">
                    {data.payment.transactionId}
                  </Text>
                </YStack>

                <YStack gap="$3">
                  <Text fontSize={12} color="gray" textTransform="uppercase">
                    Payment Method
                  </Text>
                  <Text fontSize={14} fontWeight="600">
                    {data.payment.method.toUpperCase()}
                  </Text>
                </YStack>

                <YStack gap="$3">
                  <Text fontSize={12} color="gray" textTransform="uppercase">
                    Payment Status
                  </Text>
                  <Text fontSize={14} fontWeight="600" color="$green10">
                    {data.payment.status.toUpperCase()}
                  </Text>
                </YStack>
              </YStack>
            </YStack>
          </Card>

          {/* Customer Details */}
          <Card padding="$5" borderRadius="$8" borderWidth={1} borderColor="$borderColor">
            <YStack gap="$4">
              <XStack items="center" gap="$2">
                <Ionicons name="person-outline" size={20} color="gray" />
                <Text fontSize={18} fontWeight="700">
                  Customer Details
                </Text>
              </XStack>

              <YStack gap="$3">
                <YStack gap="$1">
                  <Text fontSize={12} color="gray" textTransform="uppercase">
                    Name
                  </Text>
                  <Text fontSize={14} fontWeight="600">
                    {data.user.name}
                  </Text>
                </YStack>

                <YStack gap="$1">
                  <Text fontSize={12} color="gray" textTransform="uppercase">
                    Email
                  </Text>
                  <Text fontSize={14} fontWeight="600">
                    {data.user.email}
                  </Text>
                </YStack>

                <YStack gap="$1">
                  <Text fontSize={12} color="gray" textTransform="uppercase">
                    Phone
                  </Text>
                  <Text fontSize={14} fontWeight="600">
                    {data.user.phone || 'N/A'}
                  </Text>
                </YStack>
              </YStack>
            </YStack>
          </Card>

          {/* Action Buttons */}
          <YStack gap="$3" paddingBlockStart="$4">
            <Button
              size="$5"
              themeInverse
              onPress={handleShare}
              disabled={true}
              icon={isSharing ? <Spinner size="small" color="white" /> : undefined}>
              <XStack items="center" gap="$2">
                {!isSharing && <Ionicons name="share-outline" size={20} color="white" />}
                <Text fontSize={16} fontWeight="700" color="white">
                  {isSharing ? 'Sharing...' : 'Share Receipt'}
                </Text>
              </XStack>
            </Button>

            <Button
              size="$5"
              variant="outlined"
              borderColor="$borderColor"
              disabled
              onPress={handleDownload}>
              <XStack items="center" gap="$2">
                <Ionicons name="download-outline" size={20} color="$blue10" />
                <Text fontSize={16} fontWeight="700" color="$blue10">
                  Download PDF
                </Text>
              </XStack>
            </Button>

            <Button
              size="$5"
              variant="outlined"
              borderColor="$borderColor"
              onPress={() => router.push(`/draw/${data.draw.id}`)}>
              <XStack items="center" gap="$2">
                <Ionicons name="eye-outline" size={20} />
                <Text fontSize={16} fontWeight="700">
                  View Draw Details
                </Text>
              </XStack>
            </Button>
          </YStack>

          {/* Footer */}
          <Card
            padding="$4"
            borderRadius="$6"
            backgroundColor="$background08"
            borderWidth={1}
            borderColor="$borderColor">
            <YStack items="center" gap="$2">
              <Text fontSize={12} color="gray" text="center">
                Thank you for participating in our lucky draw!
              </Text>
              <Text fontSize={10} color="gray" text="center">
                For support, contact us at support@luckydraw.com
              </Text>
            </YStack>
          </Card>
        </YStack>
      </ScrollView>
    </>
  );
}
