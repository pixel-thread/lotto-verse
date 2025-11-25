import React from 'react';
import { ScrollView } from 'react-native';
import { router, Stack } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { YStack, XStack, Card, Text, Avatar, Separator, Button } from 'tamagui';

import http from '@/src/utils/http';
import { CustomHeader } from '@/src/components/common/CustomHeader';
import { ADMIN_TRANSACTION_ENDPOINTS } from '@/src/lib/endpoints/admin/transactions';
import { getStatusColor } from '@/src/utils/helper/getStatusColor';
import { getStatusText } from '@/src/utils/helper/getStatusText';
import { PaymentStatusT } from '@/src/types/purchase';
import { LoadingScreen } from '../../../common/LoadingScreen';
import { RefreshControl } from 'react-native-gesture-handler';

type TransactionT = {
  id: string;
  transactionId: string;
  amount: number;
  status: PaymentStatusT;
  paymentMethod: string;
  createdAt: string;
  userId: string;
  name: string;
  imageUrl: string | null;
  updatedAt: string;
};

export default function AdminTransactionsScreen() {
  const {
    data: transactions,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['admin', 'transactions'],
    queryFn: () => http.get<TransactionT[]>(ADMIN_TRANSACTION_ENDPOINTS.GET_ALL_TRANSACTONS),
    select: (res) => res.data,
  });

  if (isFetching) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Transactions',
          header: ({ back }) => <CustomHeader back={!!back} />,
        }}
      />

      <ScrollView
        refreshControl={<RefreshControl onRefresh={() => refetch()} refreshing={isFetching} />}
        style={{ width: '100%' }}>
        <YStack p="$4" gap="$4">
          {transactions &&
            transactions?.map((tx) => {
              return (
                <Card bordered p="$4" key={tx.id} gap="$3">
                  {/* User Row */}
                  <XStack gap="$3" items="center">
                    <Avatar size="$4" circular>
                      <Avatar.Image src={tx?.imageUrl || ''} />
                      <Avatar.Fallback />
                    </Avatar>
                    <YStack>
                      <Text fontWeight="700">{tx.name}</Text>
                      <Text fontSize={12} color="grey">
                        User ID: {tx.userId}
                      </Text>
                    </YStack>
                  </XStack>

                  <Separator />

                  {/* Transaction Info */}
                  <XStack justify="space-between">
                    <Text fontWeight="600">Transaction ID:</Text>
                    <Text>₹ {tx.transactionId}</Text>
                  </XStack>

                  <XStack justify="space-between">
                    <Text fontWeight="600">Amount</Text>
                    <Text>₹ {tx.amount}</Text>
                  </XStack>

                  <XStack justify="space-between">
                    <Text fontWeight="600">Payment Method</Text>
                    <Text>{tx.paymentMethod}</Text>
                  </XStack>

                  <XStack justify="space-between">
                    <Text fontWeight="600">Status</Text>
                    <Text fontWeight="700" color={getStatusColor(tx.status)}>
                      {getStatusText(tx.status)}
                    </Text>
                  </XStack>

                  <XStack justify="space-between">
                    <Text fontWeight="600">Created</Text>
                    <Text>{tx.createdAt}</Text>
                  </XStack>

                  <XStack justify="space-between">
                    <Text fontWeight="600">Updated</Text>
                    <Text>{tx.updatedAt}</Text>
                  </XStack>

                  {/* See More */}
                  <Button
                    marginBlockStart="$3"
                    onPress={() => router.push(`/admin/transactions/${tx.id}`)}>
                    <Button.Text>View Details</Button.Text>
                  </Button>
                </Card>
              );
            })}
        </YStack>
      </ScrollView>
    </>
  );
}
