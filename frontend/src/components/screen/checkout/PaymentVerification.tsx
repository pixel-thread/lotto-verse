import React from 'react';
import { ScrollView } from 'react-native';
import { YStack, XStack, Text, Button, Card, H2, Spinner, View } from 'tamagui';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { PAYMENT_ENDPOINTS } from '@/src/lib/endpoints/payment';
import http from '@/src/utils/http';
import { CustomHeader } from '../../common/CustomHeader';
import { RefreshControl } from 'react-native-gesture-handler';

type DataT = {
  paymentId: string;
  orderId: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  amount?: number;
  currency?: string;
  method?: string;
  transactionId: string;
};

type PaymentVerificationProps = {
  id: string;
};

export function PaymentVerificationScreen({ id }: PaymentVerificationProps) {
  const router = useRouter();

  const { data, refetch, isFetching } = useQuery({
    queryKey: ['check payment', id],
    queryFn: () => http.get<DataT>(PAYMENT_ENDPOINTS.GET_USER_PAYMENT.replace(':id', id)),
    select: (data) => data.data,
    enabled: !!id,
  });

  const statusIcon =
    data?.status === 'SUCCESS' ? (
      <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
    ) : data?.status === 'FAILED' ? (
      <Ionicons name="close-circle" size={64} color="#F44336" />
    ) : (
      <Ionicons name="time-outline" size={64} color="#FFC107" />
    );

  const statusText =
    data?.status === 'SUCCESS'
      ? 'Payment Successful'
      : data?.status === 'FAILED'
        ? 'Payment Failed'
        : 'Payment Pending';

  if (isFetching) {
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
        <View>
          <Spinner size="large" />
        </View>
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
          {/* Status icon and message */}
          <YStack items="center" gap="$3" marginBlock="$6">
            {statusIcon}
            <H2
              fontSize={28}
              fontWeight="900"
              color={data?.status === 'SUCCESS' ? '#4CAF50' : '#F44336'}>
              {statusText}
            </H2>
          </YStack>

          {/* Payment Details */}
          <Card
            padding="$4"
            borderRadius="$6"
            themeInverse
            borderWidth={1}
            borderColor="$borderColor">
            <YStack gap="$3">
              <Text fontSize={16} fontWeight="700">
                Payment Details
              </Text>

              <XStack justify="space-between">
                <Text>Transaction ID</Text>
                <Text fontWeight="600">{data?.transactionId || '-'}</Text>
              </XStack>

              <XStack justify="space-between">
                <Text>Payment ID</Text>
                <Text fontWeight="600">{data?.paymentId || '-'}</Text>
              </XStack>

              <XStack justify="space-between">
                <Text>Order ID</Text>
                <Text fontWeight="600">{data?.orderId || '-'}</Text>
              </XStack>

              <XStack justify="space-between">
                <Text>Amount</Text>
                <Text fontWeight="600">
                  {data?.amount !== undefined
                    ? `${data?.currency || '₹'}${(data?.amount / 100).toFixed(2)}`
                    : '-'}
                </Text>
              </XStack>

              <XStack justify="space-between">
                <Text>Payment Method</Text>
                <Text fontWeight="600">{data?.method || '-'}</Text>
              </XStack>
            </YStack>
          </Card>

          {/* Action Buttons */}
          <YStack gap="$3" paddingBlockStart="$4">
            {data?.status === 'SUCCESS' ? (
              <Button size="$5" themeInverse onPress={() => router.push('/')}>
                <Text fontSize={16} fontWeight="700" color="white">
                  Go to Home
                </Text>
              </Button>
            ) : (
              <Button
                size="$5"
                borderWidth={1}
                onPress={() => router.push('/draw/checkout')}
                disabled={data?.status === 'PENDING'}>
                <Text fontSize={16} fontWeight="700">
                  {data?.status === 'PENDING' ? 'Waiting for Confirmation...' : 'Try Again'}
                </Text>
              </Button>
            )}
          </YStack>
        </YStack>
      </ScrollView>
    </>
  );
}
