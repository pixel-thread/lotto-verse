import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { YStack, XStack, Text, Button, Card, H2, Spinner, Circle, Separator } from 'tamagui';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { PAYMENT_ENDPOINTS } from '@/src/lib/endpoints/payment';
import http from '@/src/utils/http';
import { CustomHeader } from '../../common/CustomHeader';
import { RefreshControl } from 'react-native-gesture-handler';
import { getStatusIcon } from '@/src/utils/helper/getStatusIcon';
import { getStatusColor } from '@/src/utils/helper/getStatusColor';
import { getStatusText } from '@/src/utils/helper/getStatusText';
import { formatDate } from '@/src/utils/helper/formatDate';

type DataT = {
  id: string;
  paymentId: string;
  orderId: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  amount?: number;
  currency?: string;
  method?: string;
  transactionId: string;
  luckyNumberId: string;
  number: number;
  createdAt?: Date;
};

type PaymentVerificationProps = {
  id: string;
};

export function PaymentVerificationScreen({ id }: PaymentVerificationProps) {
  const router = useRouter();
  const [status, setStatus] = useState('PENDING');

  const { data, refetch, isFetching } = useQuery({
    queryKey: ['check payment', id],
    queryFn: () => http.get<DataT>(PAYMENT_ENDPOINTS.GET_USER_PAYMENT.replace(':id', id)),
    select: (data) => data.data,
    enabled: !!id,
    refetchInterval: status === 'PENDING' ? 3000 : false, // Auto-refresh for pending
  });

  const statusText = getStatusText(data?.status || '');
  const statusColor = getStatusColor(data?.status || '');
  const statusIcon = getStatusIcon(data?.status || '');

  useEffect(() => {
    if (data?.status) {
      setStatus(data.status);
    }
  }, [data?.status]);

  if (isFetching && !data) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Payment Verification',
            headerShown: true,
            headerBackTitle: 'Back',
            header: ({ back }) => <CustomHeader back={!!back} />,
          }}
        />
        <YStack flex={1} justify="center" items="center" gap="$4">
          <Spinner size="large" color={statusColor} />
          <Text fontSize={16} color="gray">
            Verifying your payment...
          </Text>
        </YStack>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Payment Verification',
          headerShown: true,
          headerBackTitle: 'Back',
          header: ({ back }) => <CustomHeader back={!!back} />,
        }}
      />
      <ScrollView
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
        contentContainerStyle={{ padding: 20, paddingBottom: 50 }}>
        <YStack gap="$6" maxW={600} self="center" width="100%">
          {/* Status Icon and Message */}
          <YStack
            items="center"
            gap="$4"
            marginBlock="$6"
            animation="quick"
            enterStyle={{ opacity: 0, scale: 0.8 }}
            exitStyle={{ opacity: 0, scale: 0.8 }}>
            <Circle
              size={120}
              // backgroundColor={getStatusColor(data?.status || '')}
              borderWidth={4}
              borderColor={statusColor}
              items="center"
              justify="center">
              <Ionicons name={statusIcon as any} size={64} color={statusColor} />
            </Circle>

            <YStack items="center" gap="$2">
              <H2 fontSize={32} fontWeight="900" color={statusColor}>
                {statusText}
              </H2>
              {data?.status === 'SUCCESS' && (
                <Text fontSize={16} color="gray" text="center">
                  Your payment has been processed successfully
                </Text>
              )}
              {data?.status === 'PENDING' && (
                <XStack items="center" gap="$2">
                  <Spinner size="small" color={statusColor} />
                  <Text fontSize={16} color={statusColor} text="center">
                    Waiting for payment confirmation...
                  </Text>
                </XStack>
              )}
              {data?.status === 'FAILED' && (
                <Text fontSize={16} color="gray" text="center">
                  We couldn't process your payment
                </Text>
              )}
            </YStack>
          </YStack>

          {/* Payment Amount Card */}
          {data?.amount !== undefined && (
            <Card
              padding="$5"
              borderRadius="$8"
              backgroundColor={
                data?.status === 'SUCCESS'
                  ? '$green2'
                  : data?.status === 'FAILED'
                    ? '$red2'
                    : '$yellow2'
              }
              borderWidth={2}
              borderColor={statusColor}>
              <YStack items="center" gap="$2">
                <Text fontSize={14} color="gray" textTransform="uppercase" fontWeight="600">
                  Amount {data?.status === 'SUCCESS' ? 'Paid' : 'Attempted'}
                </Text>
                <Text fontSize={48} fontWeight="900" color={statusColor}>
                  {data?.currency || '₹'}
                  {` `} {(data?.amount).toFixed(2)}
                </Text>
                {data?.method && (
                  <XStack items="center" gap="$2">
                    <Ionicons name="card-outline" size={16} color={statusColor} />
                    <Text fontSize={14} color={statusColor} fontWeight="600">
                      {data.method.toUpperCase()}
                    </Text>
                  </XStack>
                )}
              </YStack>
            </Card>
          )}

          {/* Payment Details */}
          <Card
            padding="$5"
            borderRadius="$8"
            borderWidth={1}
            borderColor="$borderColor"
            backgroundColor="$background">
            <YStack gap="$4">
              <XStack items="center" gap="$2">
                <Ionicons name="receipt-outline" size={20} color="gray" />
                <Text fontSize={18} fontWeight="700">
                  Transaction Details
                </Text>
              </XStack>

              <Separator borderColor="$borderColor" />

              <YStack gap="$3">
                <XStack justify="space-between" items="center">
                  <Text fontSize={14} color="gray">
                    Transaction ID
                  </Text>
                  <Text fontSize={14} fontWeight="600" maxW="60%">
                    {data?.transactionId || '-'}
                  </Text>
                </XStack>

                <XStack justify="space-between" items="center">
                  <Text fontSize={14} color="gray">
                    Payment ID
                  </Text>
                  <Text fontSize={14} fontWeight="600" maxW="60%">
                    {data?.paymentId || '-'}
                  </Text>
                </XStack>

                <XStack justify="space-between" items="center">
                  <Text fontSize={14} color="gray">
                    Order ID
                  </Text>
                  <Text fontSize={14} fontWeight="600" maxW="60%">
                    {data?.orderId || '-'}
                  </Text>
                </XStack>

                {data?.createdAt && (
                  <XStack justify="space-between" items="center">
                    <Text fontSize={14} color="gray">
                      Date & Time
                    </Text>
                    <Text fontSize={14} fontWeight="600">
                      {formatDate(data.createdAt)}
                    </Text>
                  </XStack>
                )}
              </YStack>
            </YStack>
          </Card>

          {/* Success Message with Tips */}
          {data?.status === 'SUCCESS' && (
            <Card
              padding="$4"
              borderRadius="$6"
              backgroundColor="$green3"
              borderWidth={1}
              borderColor="$green8">
              <XStack items="flex-start" gap="$3">
                <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
                <YStack gap="$2" flex={1}>
                  <Text fontSize={16} fontWeight="700" color="$green10">
                    Payment Confirmed!
                  </Text>
                  <Text fontSize={14} color="$green11">
                    Your lucky numbers have been secured. You can view your purchase in the billing
                    section.
                  </Text>
                </YStack>
              </XStack>
            </Card>
          )}

          {/* Failure Message with Help */}
          {data?.status === 'FAILED' && (
            <Card
              padding="$4"
              borderRadius="$6"
              backgroundColor="$red3"
              borderWidth={1}
              borderColor="$red8">
              <XStack items="flex-start" gap="$3">
                <Ionicons name="information-circle" size={24} color="#ef4444" />
                <YStack gap="$2" flex={1}>
                  <Text fontSize={16} fontWeight="700" color="$red10">
                    Payment Failed
                  </Text>
                  <Text fontSize={14} color="$red11">
                    Don't worry, no money has been deducted. Please try again or contact support if
                    the issue persists.
                  </Text>
                </YStack>
              </XStack>
            </Card>
          )}

          {/* Action Buttons */}
          <YStack gap="$3" paddingBlockStart="$4">
            {data?.status === 'SUCCESS' ? (
              <>
                {data?.paymentId && (
                  <Button size="$5" bg="$green8" onPress={() => router.push(`/billing/${data.id}`)}>
                    <XStack items="center" gap="$2">
                      <Ionicons name="receipt-outline" size={20} color="white" />
                      <Text fontSize={16} fontWeight="700" color="white">
                        View Receipt
                      </Text>
                    </XStack>
                  </Button>
                )}
                <Button size="$5" themeInverse onPress={() => router.push('/')}>
                  <XStack items="center" gap="$2">
                    <Ionicons name="home-outline" size={20} color="white" />
                    <Text fontSize={16} fontWeight="700" color="white">
                      Go to Home
                    </Text>
                  </XStack>
                </Button>
              </>
            ) : data?.status === 'PENDING' ? (
              <>
                <Button
                  size="$5"
                  bg={getStatusColor(data?.status || '')}
                  onPress={() => refetch()}
                  icon={isFetching ? <Spinner size="small" color="white" /> : undefined}>
                  <Text fontSize={16} fontWeight="700" color="white">
                    {isFetching ? 'Checking...' : 'Check Status'}
                  </Text>
                </Button>
                <Button
                  size="$5"
                  variant="outlined"
                  borderColor="$borderColor"
                  onPress={() => router.push('/')}>
                  <Text fontSize={16} fontWeight="700">
                    Go to Home
                  </Text>
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="$5"
                  themeInverse
                  onPress={() => router.push(`/draw/checkout?numberId=${data?.luckyNumberId}`)}>
                  <XStack items="center" gap="$2">
                    <Ionicons name="refresh-outline" size={20} color="white" />
                    <Text fontSize={16} fontWeight="700" color="white">
                      Try Again
                    </Text>
                  </XStack>
                </Button>
                <Button
                  size="$5"
                  variant="outlined"
                  borderColor="$borderColor"
                  onPress={() => router.push('/')}>
                  <Text fontSize={16} fontWeight="700">
                    Go to Home
                  </Text>
                </Button>
              </>
            )}
          </YStack>

          {/* Support Section */}
          <Card
            padding="$4"
            borderRadius="$6"
            backgroundColor={'$background02'}
            borderWidth={1}
            borderColor="$borderColor">
            <YStack items="center" gap="$2">
              <XStack items="center" gap="$2">
                <Ionicons name="help-circle-outline" size={20} color="gray" />
                <Text fontSize={14} color="gray" fontWeight="600">
                  Need Help?
                </Text>
              </XStack>
              <Text fontSize={12} color="gray" text="center">
                Contact our support team for assistance
              </Text>
              <Button size="$3" variant="outlined" borderColor="$borderColor" marginBlockStart="$2">
                <Text fontSize={14} fontWeight="600">
                  Contact Support
                </Text>
              </Button>
            </YStack>
          </Card>
        </YStack>
      </ScrollView>
    </>
  );
}
