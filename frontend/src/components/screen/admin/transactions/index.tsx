import React from 'react';
import { ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import {
  YStack,
  XStack,
  Card,
  Text,
  Avatar,
  Separator,
  Button,
  Select,
  Adapt,
  Sheet,
  SelectProvider,
} from 'tamagui';

import http from '@/src/utils/http';
import { ADMIN_TRANSACTION_ENDPOINTS } from '@/src/lib/endpoints/admin/transactions';
import { getStatusColor } from '@/src/utils/helper/getStatusColor';
import { getStatusText } from '@/src/utils/helper/getStatusText';
import { PaymentStatusT } from '@/src/types/purchase';
import { RefreshControl } from 'react-native-gesture-handler';
import { EmptyCard } from '@/src/components/common/EmptyCard';
import { DrawT } from '@/src/types/draw';
import { ADMIN_DRAW_ENDPOINTS } from '@/src/lib/endpoints/admin/draws';
import { Ternary } from '@/src/components/common/Ternary';

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
  const [value, setValue] = React.useState('');

  const { data = [], isFetching: isFetchingDraw } = useQuery({
    queryKey: ['draw'],
    queryFn: () => http.get<DrawT[]>(ADMIN_DRAW_ENDPOINTS.GET_ALL_DRAW),
    select: (res) => res.data,
  });

  const {
    data: transactions,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['admin', 'transactions', value],
    queryFn: () =>
      http.post<TransactionT[]>(ADMIN_TRANSACTION_ENDPOINTS.POST_ALL_TRANSACTION, {
        drawId: value,
      }),
    select: (res) => res.data,
    enabled: !!value,
  });

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl onRefresh={() => refetch()} refreshing={isFetching || isFetchingDraw} />
        }
        style={{ width: '100%' }}>
        <YStack p="$4" gap="$4">
          <Text fontWeight={'500'} fontSize="$5">
            Select a draw
          </Text>
          <SelectProvider>
            <Select value={value} onValueChange={setValue}>
              <Select.Trigger disabled={isFetchingDraw || isFetching} bg={'$background'}>
                <Select.Value bg={'$background'} placeholder="Select a draw..." />
              </Select.Trigger>

              <Adapt when="maxMd" platform="touch">
                <Sheet modal>
                  <Sheet.Frame>
                    <Adapt.Contents />
                  </Sheet.Frame>
                  <Sheet.Overlay />
                </Sheet>
              </Adapt>

              <Select.Content>
                <Select.ScrollUpButton />
                <Select.Viewport>
                  <Select.Label>Select a draw</Select.Label>
                  {data &&
                    data?.map((item, i) => (
                      <Select.Item bordered key={item.id} value={item.id} index={i}>
                        <Select.ItemText fontWeight={'600'} fontSize="$4">
                          {item.month}
                        </Select.ItemText>
                      </Select.Item>
                    ))}
                </Select.Viewport>
                <Select.ScrollDownButton />
              </Select.Content>
            </Select>
          </SelectProvider>
        </YStack>
        <Ternary
          condition={transactions?.length === 0}
          ifTrue={<EmptyCard message="No transactions found" title="No Transactions" />}
          ifFalse={
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
                        <Text fontWeight="600">TID:</Text>
                        <Text>{tx.transactionId}</Text>
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
          }
        />
      </ScrollView>
    </>
  );
}
