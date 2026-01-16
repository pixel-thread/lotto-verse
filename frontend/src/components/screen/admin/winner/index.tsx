import React from 'react';
import { ScrollView } from 'react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import { YStack, XStack, Card, Text, Avatar, Button, Separator, View } from 'tamagui';
import http from '@/src/utils/http';
import { LoadingScreen } from '../../../common/LoadingScreen';
import { ADMIN_WINNER_ENDPOINTS } from '@/src/lib/endpoints/admin/winner';
import { EmptyCard } from '@/src/components/common/EmptyCard';
import { RefreshControl } from 'react-native-gesture-handler';
import { useAuth } from '@/src/hooks/auth/useAuth';

type ResponseT = {
  id: string;
  userId: string;
  name: string;
  imageUrl: string;
  draw: string;
  luckyNumber: {
    id: string;
    number: string;
    isPurchased: boolean;
    winnerId: string;
  };
  isPaid: false;
  paidAt: null;
  prizeAmount: number;
};

const AdminWinnersScreen = () => {
  const { isSuperAdmin } = useAuth();
  const {
    data = [],
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['admin', 'winners', 'list'],
    queryFn: () => http.get<ResponseT[]>(ADMIN_WINNER_ENDPOINTS.GET_ALL_WINNER),
    select: (data) => data.data,
  });

  const { mutate: markPaid, isPending } = useMutation({
    mutationFn: (id: string) => http.put(ADMIN_WINNER_ENDPOINTS.PUT_MARK_PAID, { winnerId: id }),
    onSuccess: () => refetch(),
  });

  if (isFetching) {
    return <LoadingScreen />;
  }

  if (!data || data.length === 0 || data === undefined) {
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
        <View p="$4" gap="$4">
          <Card padding="$5" rounded="$8" bordered>
            <YStack gap="$2" items="center">
              <Text fontSize="$8" fontWeight="900">
                All Winners
              </Text>
              <Text fontSize="$3" color="gray">
                Total Winners: {data.length}
              </Text>
            </YStack>
          </Card>
          <YStack gap="$4">
            {data &&
              data?.map((winner) => (
                <Card key={winner.id} bordered p="$4" gap="$3">
                  {/* Header: Winner Name + Avatar */}
                  <XStack items="center" gap="$3">
                    <Avatar circular size="$5">
                      {winner.imageUrl ? (
                        <Avatar.Image src={winner.imageUrl} />
                      ) : (
                        <Avatar.Fallback />
                      )}
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
                    <Text fontWeight="600">Draw:</Text>
                    <Text>{winner.draw}</Text>
                  </XStack>

                  <XStack justify="space-between">
                    <Text fontWeight="600">Lucky Number:</Text>
                    <Text>{winner.luckyNumber.number}</Text>
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
                  {!winner.isPaid && isSuperAdmin && (
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
        </View>
      </ScrollView>
    </>
  );
};

export default AdminWinnersScreen;
