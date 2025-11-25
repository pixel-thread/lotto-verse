import React from 'react';
import { ScrollView } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { YStack, XStack, Text, Avatar, Separator, Button, Card, Spinner } from 'tamagui';

import http from '@/src/utils/http';
import { ADMIN_TRANSACTION_ENDPOINTS } from '@/src/lib/endpoints/admin/transactions';
import { CustomHeader } from '../../../common/CustomHeader';
import { getStatusColor } from '@/src/utils/helper/getStatusColor';
import { LoadingScreen } from '../../../common/LoadingScreen';
import { PaymentStatusT } from '@/src/types/purchase';

type TransactionT = {
  id: string;
  amount: number;
  status: PaymentStatusT;
  paymentMethod: string;
  createdAt: string;
  userId: string;
  name: string;
  imageUrl: string | null;
  purchaseId: string;
  number: number;
  month: string;
  entryFee: number;
  updatedAt: string;
};

export default function AdminTransactionDetail({ id }: { id: string }) {
  const {
    data: tx,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['admin', 'transaction', id],
    queryFn: () =>
      http.get<TransactionT>(
        ADMIN_TRANSACTION_ENDPOINTS.GET_TRANSACTION_BY_ID.replace(':id', id.toString() || '')
      ),
    select: (res) => res.data,
  });

  const initials = tx?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('');

  if (isFetching) {
    return <LoadingScreen />;
  }

  return (
    <>
      {!isFetching && tx && (
        <ScrollView style={{ width: '100%' }}>
          <YStack p="$4" gap="$4">
            {/* USER INFO */}
            <Card bordered p="$4" gap="$3">
              <Text fontWeight="700" fontSize="$6">
                User
              </Text>

              <XStack gap="$3" items="center">
                <Avatar size="$5" circular>
                  {tx.imageUrl ? (
                    <Avatar.Image src={tx.imageUrl} />
                  ) : (
                    <Avatar.Fallback>
                      <Text fontWeight="700">{initials}</Text>
                    </Avatar.Fallback>
                  )}
                </Avatar>

                <YStack>
                  <Text fontWeight="700">{tx.name}</Text>
                  <Text fontSize={12} color="grey">
                    ID: {tx.userId}
                  </Text>
                </YStack>
              </XStack>
            </Card>

            {/* TRANSACTION INFO */}
            <Card bordered p="$4" gap="$3">
              <Text fontWeight="700" fontSize="$6">
                Transaction
              </Text>

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
                  {tx.status}
                </Text>
              </XStack>

              <Separator />

              <XStack justify="space-between">
                <Text fontWeight="600">Created</Text>
                <Text>{tx.createdAt}</Text>
              </XStack>

              <XStack justify="space-between">
                <Text fontWeight="600">Updated</Text>
                <Text>{tx.updatedAt}</Text>
              </XStack>
            </Card>

            {/* PURCHASE INFO (IF EXISTS) */}
            {tx.purchaseId && (
              <Card bordered p="$4" gap="$3">
                <Text fontWeight="700" fontSize="$6">
                  Purchase
                </Text>
                <XStack justify="space-between">
                  <Text fontWeight="600">Transaction ID</Text>
                  <Text>{tx.id}</Text>
                </XStack>

                <XStack justify="space-between">
                  <Text fontWeight="600">Purchase ID</Text>
                  <Text>{tx.purchaseId}</Text>
                </XStack>

                <XStack justify="space-between">
                  <Text fontWeight="600">Lucky Number</Text>
                  <Text>{tx.number}</Text>
                </XStack>
              </Card>
            )}

            {/* DRAW INFO (IF EXISTS) */}
            {tx.month && (
              <Card bordered p="$4" gap="$3">
                <Text fontWeight="700" fontSize="$6">
                  Draw
                </Text>

                <XStack justify="space-between">
                  <Text fontWeight="600">Name</Text>
                  <Text>{tx.month}</Text>
                </XStack>

                <XStack justify="space-between">
                  <Text fontWeight="600">Entry Fee</Text>
                  <Text>₹ {tx.entryFee}</Text>
                </XStack>
              </Card>
            )}

            <Button onPress={() => refetch()}>
              <Button.Text>Refresh</Button.Text>
            </Button>
          </YStack>
        </ScrollView>
      )}
    </>
  );
}
