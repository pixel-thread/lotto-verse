import React from 'react';
import { YStack, XStack, Text, Card, Separator, ScrollView, Circle } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import http from '@/src/utils/http';
import { USER_ENDPOINTS } from '@/src/lib/endpoints/user';
import { LoadingScreen } from '../../common/LoadingScreen';

type PurchaseT = {
  luckyNumber: {
    number: number;
    id: string;
    drawId: string;
    isPurchased: boolean;
    winnerId: string | null;
  }[];
  id: string;
  createdAt: Date;
  userId: string;
  luckyNumberId: string;
  razorpayId: string;
  paymentId: string | null;
  amount: number;
  drawId: string;
  status: string;
};

type Props = {
  purchase: PurchaseT;
  entryFeePerNumber?: number;
};

export function BillingComponent({ purchase, entryFeePerNumber = 100 }: Props) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return '$green10';
      case 'PENDING':
        return '$orange10';
      case 'FAILED':
        return '$red10';
      default:
        return 'gray';
    }
  };

  const quantity = purchase.luckyNumber.length;
  const subtotal = quantity * entryFeePerNumber;
  const tax = 0; // Add tax calculation if needed
  const total = purchase.amount;

  return (
    <Card
      padding="$5"
      rounded="$8"
      borderWidth={1}
      borderColor="$borderColor"
      backgroundColor="$background">
      <YStack gap="$4">
        {/* Header */}
        <YStack gap="$2" items="center" paddingBottom="$3">
          <Circle size={48} backgroundColor="$green5">
            <Ionicons name="receipt-outline" size={24} color="#22c55e" />
          </Circle>
          <Text fontSize={24} fontWeight="900">
            Purchase Receipt
          </Text>
          <Text fontSize={12} color="gray" textTransform="uppercase" fontWeight="600">
            #{purchase.id.slice(-8)}
          </Text>
        </YStack>

        <Separator borderColor="$borderColor" />

        {/* Purchase Info */}
        <YStack gap="$2">
          <XStack justify="space-between">
            <Text fontSize={12} color="gray" textTransform="uppercase" fontWeight="600">
              Date & Time
            </Text>
            <Text fontSize={14} fontWeight="600">
              {formatDate(purchase.createdAt)}
            </Text>
          </XStack>

          <XStack justify="space-between">
            <Text fontSize={12} color="gray" textTransform="uppercase" fontWeight="600">
              Status
            </Text>
            <XStack items="center" gap="$2">
              <Circle size={8} backgroundColor={getStatusColor(purchase.status)} />
              <Text fontSize={14} fontWeight="700" color={getStatusColor(purchase.status)}>
                {purchase.status}
              </Text>
            </XStack>
          </XStack>

          {purchase.paymentId && (
            <XStack justify="space-between">
              <Text fontSize={12} color="gray" textTransform="uppercase" fontWeight="600">
                Payment ID
              </Text>
              <Text fontSize={12} fontFamily="$mono" color="$gray11">
                {purchase.paymentId.slice(-12)}
              </Text>
            </XStack>
          )}
        </YStack>

        <Separator borderColor="$borderColor" />

        {/* Lucky Numbers Section */}
        <YStack gap="$3">
          <Text fontSize={16} fontWeight="700" textTransform="uppercase" color="gray">
            Lucky Numbers Purchased
          </Text>

          {/* Numbers Grid */}
          <ScrollView maxHeight={200} showsVerticalScrollIndicator={false}>
            <XStack flexWrap="wrap" gap="$2">
              {purchase.luckyNumber.map((num) => (
                <Card
                  key={num.id}
                  padding="$3"
                  paddingHorizontal="$4"
                  rounded="$5"
                  backgroundColor={num.winnerId ? '$green10' : '$blue6'}
                  borderWidth={2}
                  borderColor={num.winnerId ? '$green8' : '$blue8'}
                  minWidth={80}
                  items="center">
                  <XStack items="center" gap="$2">
                    <Text fontSize={24} fontWeight="900" color="white">
                      {num.number}
                    </Text>
                    {num.winnerId && <Ionicons name="trophy" size={18} color="white" />}
                  </XStack>
                </Card>
              ))}
            </XStack>
          </ScrollView>
        </YStack>

        <Separator borderColor="$borderColor" />

        {/* Billing Breakdown */}
        <YStack gap="$3">
          <Text fontSize={16} fontWeight="700" textTransform="uppercase" color="gray">
            Billing Details
          </Text>

          {/* Line Items */}
          <YStack gap="$2">
            <XStack justify="space-between" items="center">
              <Text fontSize={14} color="gray">
                Lucky Numbers ({quantity} × ₹{entryFeePerNumber})
              </Text>
              <Text fontSize={16} fontWeight="600">
                ₹ {subtotal}
              </Text>
            </XStack>

            {tax > 0 && (
              <XStack justify="space-between" items="center">
                <Text fontSize={14} color="gray">
                  Tax & Fees
                </Text>
                <Text fontSize={16} fontWeight="600">
                  ₹ {tax}
                </Text>
              </XStack>
            )}
          </YStack>

          <Separator borderColor="$borderColor" />

          {/* Total */}
          <XStack justify="space-between" items="center" paddingTop="$2">
            <Text fontSize={18} fontWeight="700" textTransform="uppercase">
              Total Amount
            </Text>
            <Text fontSize={28} fontWeight="900" color="$green10">
              ₹ {total}
            </Text>
          </XStack>
        </YStack>

        {/* Footer Info */}
        {purchase.status === 'COMPLETED' && (
          <>
            <Separator borderColor="$borderColor" />
            <XStack items="center" gap="$2" justify="center" paddingTop="$2">
              <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
              <Text fontSize={12} color="$green10" fontWeight="600" textAlign="center">
                Payment confirmed and numbers secured
              </Text>
            </XStack>
          </>
        )}

        {purchase.status === 'PENDING' && (
          <>
            <Separator borderColor="$borderColor" />
            <XStack items="center" gap="$2" justify="center" paddingTop="$2">
              <Ionicons name="time" size={20} color="#f59e0b" />
              <Text fontSize={12} color="$orange10" fontWeight="600" textAlign="center">
                Payment processing - Numbers reserved
              </Text>
            </XStack>
          </>
        )}
      </YStack>
    </Card>
  );
}

// Compact version for lists
export function BillingComponentCompact({ purchase, entryFeePerNumber = 100 }: Props) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card
      padding="$4"
      rounded="$6"
      borderWidth={1}
      borderColor="$borderColor"
      pressStyle={{ scale: 0.98 }}
      animation="quick">
      <YStack gap="$3">
        {/* Header */}
        <XStack justify="space-between" items="center">
          <YStack gap="$1">
            <Text fontSize={10} color="gray" textTransform="uppercase" fontWeight="700">
              Receipt #{purchase.id.slice(-6)}
            </Text>
            <Text fontSize={12} color="gray">
              {formatDate(purchase.createdAt)}
            </Text>
          </YStack>
          <Text fontSize={24} fontWeight="900" color="$green10">
            ₹ {purchase.amount}
          </Text>
        </XStack>

        {/* Numbers Preview */}
        <YStack gap="$2">
          <Text fontSize={12} color="gray" fontWeight="600">
            Numbers ({purchase.luckyNumber.length})
          </Text>
          <XStack gap="$2" flexWrap="wrap">
            {purchase.luckyNumber.slice(0, 6).map((num) => (
              <Card
                key={num.id}
                padding="$2"
                paddingHorizontal="$3"
                rounded="$4"
                backgroundColor="$blue6"
                borderWidth={1}
                borderColor="$blue8">
                <Text fontSize={16} fontWeight="800" color="white">
                  {num.number}
                </Text>
              </Card>
            ))}
            {purchase.luckyNumber.length > 6 && (
              <Card padding="$2" paddingHorizontal="$3" rounded="$4" backgroundColor="$gray5">
                <Text fontSize={14} fontWeight="700" color="gray">
                  +{purchase.luckyNumber.length - 6}
                </Text>
              </Card>
            )}
          </XStack>
        </YStack>
      </YStack>
    </Card>
  );
}

// List component to show all purchases
export function Billing() {
  const {
    isFetching: isLoading,
    data: purchases,
    refetch,
  } = useQuery({
    queryFn: () => http.get<PurchaseT[]>(USER_ENDPOINTS.GET_RECENT_PURCHASES),
    queryKey: ['purchases'],
    select: (data) => data.data,
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!purchases || purchases.length === 0) {
    return (
      <YStack flex={1} justify="center" items="center" padding="$4">
        <Circle size={64} backgroundColor="$gray5">
          <Ionicons name="receipt-outline" size={32} color="gray" />
        </Circle>
        <Text fontSize={18} fontWeight="700" marginTop="$4">
          No Purchases Yet
        </Text>
        <Text fontSize={14} color="gray" textAlign="center" marginTop="$2">
          Your purchase history will appear here
        </Text>
      </YStack>
    );
  }

  return (
    <ScrollView padding="$4" showsVerticalScrollIndicator={false}>
      <YStack gap="$4">
        {purchases.map((purchase) => (
          <BillingComponentCompact key={purchase.id} purchase={purchase} />
        ))}
      </YStack>
    </ScrollView>
  );
}
