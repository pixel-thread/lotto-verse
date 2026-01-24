import React from 'react';
import { YStack, XStack, Text, Card, Button, ScrollView, Avatar } from 'tamagui';
import { router, Stack } from 'expo-router';
import { CustomHeader } from '../../common/CustomHeader';
import { useQuery } from '@tanstack/react-query';
import http from '@/src/utils/http';
import { DRAW_ENDPOINTS } from '@/src/lib/endpoints/draw';
import { DrawT } from '@/src/types/draw';
import { RefreshControl } from 'react-native-gesture-handler';
import { Ternary } from '../../common/Ternary';
import { EmptyCard } from '../../common/EmptyCard';

export const DrawsScreen = () => {
  const {
    data: prevDraws,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['draws', 'prev'],
    queryFn: () => http.get<DrawT[]>(DRAW_ENDPOINTS.GET_DRAWS),
    select: (data) => data.data,
  });
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Luck Draw',
          headerShown: true,
          header: ({ back }) => <CustomHeader back={!!back} />,
        }}
      />
      <ScrollView
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
        p="$4"
        style={{ width: '100%' }}>
        <Ternary
          condition={prevDraws?.length === 0 || !prevDraws}
          ifTrue={
            <EmptyCard
              title="No Previous Draws"
              message="There are no previous draws at the moment. Please check back later."
              isFetching={isFetching}
              onRefresh={refetch}
            />
          }
          ifFalse={
            <YStack gap="$4" paddingBlock="$4">
              {prevDraws &&
                prevDraws?.map((draw) => {
                  return (
                    <Card
                      key={draw.id}
                      padding="$4"
                      rounded="$8"
                      borderWidth={1}
                      borderColor="$borderColor">
                      <YStack gap="$2">
                        <Text fontWeight="700" fontSize={18} textTransform="uppercase">
                          {draw.month} Draw
                        </Text>
                        <Text fontSize={32} fontWeight="900" color="$green10">
                          ₹ {draw.prize.amount}
                        </Text>
                      </YStack>
                      <XStack justify="flex-start" gap={'$5'} items="center" marginBlockStart="$3">
                        <XStack items="center" gap="$3">
                          <Avatar circular>
                            {draw.winner?.imageUrl ? (
                              <Avatar.Image src={draw.winner.imageUrl} alt={draw.winner.name} />
                            ) : (
                              <Text fontSize={18} fontWeight="bold">
                                {draw.winner?.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </Text>
                            )}
                          </Avatar>
                        </XStack>
                        <YStack>
                          <Text fontWeight="600" fontSize={16}>
                            Winner: {draw.winner?.name}
                          </Text>
                          <Text fontSize={12}>Declared: {draw?.winner?.createdAt}</Text>
                        </YStack>
                      </XStack>
                      <Button
                        size="$5"
                        marginBlockStart="$4"
                        onPress={() => router.push(`/draw/${draw.id}`)}
                        themeInverse>
                        <Button.Text fontWeight="bold">View Details</Button.Text>
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
};
