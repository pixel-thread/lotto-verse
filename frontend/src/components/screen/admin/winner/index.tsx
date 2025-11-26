import React from 'react';
import { ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { YStack, XStack, Card, Text, Avatar, Button, Separator, View } from 'tamagui';
import http from '@/src/utils/http';
import { CustomHeader } from '@/src/components/common/CustomHeader';
import { LoadingScreen } from '../../../common/LoadingScreen';
import { ADMIN_WINNER_ENDPOINTS } from '@/src/lib/endpoints/admin/winner';
import { EmptyCard } from '../../../common/EmptyCard';
import { RefreshControl } from 'react-native-gesture-handler';

type ResponseT = {
  id: string;
  name: string;
  imageUrl: string;
  draw: string;
  luckyNumber: number;
  isPaid: false;
  paidAt: null;
  prizeAmount: number;
};

export default function AdminWinnersScreen() {
  const {
    data: winners,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['admin', 'winners'],
    queryFn: () => http.get<ResponseT[]>(ADMIN_WINNER_ENDPOINTS.GET_ALL_WINNER),
    select: (data) => data.data,
  });

  const { mutate: markPaid, isPending } = useMutation({
    mutationFn: (id: string) => http.put(ADMIN_WINNER_ENDPOINTS.PUT_MARK_PAID.replace(':id', id)),
    onSuccess: () => refetch(),
  });

  if (isFetching) {
    return <LoadingScreen />;
  }
  if (!winners || winners.length === 0) {
    return (
      <>
        <ScrollView
          refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
          style={{ width: '100%' }}>
          <EmptyCard
            title="No Winners Found"
            message="Please check back later"
            onRefresh={refetch}
            isFetching={isFetching}
          />
        </ScrollView>
      </>
    );
  }
  return (
    <>
      <ScrollView
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
        style={{ width: '100%' }}>
        <YStack p="$4" gap="$4">
          {winners &&
            winners?.map((winner) => (
              <Card key={winner.id} bordered p="$4" gap="$3">
                {/* Header: Winner Name + Avatar */}
                <XStack items="center" gap="$3">
                  <Avatar circular size="$5">
                    {winner.imageUrl ? <Avatar.Image src={winner.imageUrl} /> : <Avatar.Fallback />}
                  </Avatar>

                  <YStack>
                    <Text fontSize={16} fontWeight="700">
                      {winner.name}
                    </Text>
                    <Text fontSize={12} color="gray">
                      Winner ID: {winner.id}
                    </Text>
                  </YStack>
                </XStack>

                <Separator />

                {/* Detail Rows */}
                <XStack justify="space-between">
                  <Text fontWeight="600">Month:</Text>
                  <Text>{winner.draw}</Text>
                </XStack>

                <XStack justify="space-between">
                  <Text fontWeight="600">Lucky Number:</Text>
                  <Text>{winner.luckyNumber}</Text>
                </XStack>

                <XStack justify="space-between">
                  <Text fontWeight="600">Prize Amount:</Text>
                  <Text>₹ {winner.prizeAmount}</Text>
                </XStack>

                <XStack justify="space-between">
                  <Text fontWeight="600">Paid:</Text>
                  <Text color={winner.isPaid ? '$green10' : '$red10'} fontWeight="700">
                    {winner.isPaid ? 'YES' : 'NO'}
                  </Text>
                </XStack>

                {winner.paidAt && (
                  <XStack justify="space-between">
                    <Text fontWeight="600">Paid At:</Text>
                    <Text>{winner.paidAt}</Text>
                  </XStack>
                )}

                {/* Action Button */}
                {!winner.isPaid && (
                  <Button
                    marginBlockStart="$3"
                    themeInverse
                    disabled={isPending}
                    onPress={() => markPaid(winner.id)}>
                    <Button.Text>{isPending ? 'Processing...' : 'Mark as Paid'}</Button.Text>
                  </Button>
                )}
              </Card>
            ))}
        </YStack>
      </ScrollView>
    </>
  );
}
