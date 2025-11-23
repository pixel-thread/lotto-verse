import React from 'react';
import { ScrollView } from 'react-native';
import { Stack, router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { YStack, XStack, Avatar, Text, Card, Separator, Spinner } from 'tamagui';
import { RefreshControl } from 'react-native-gesture-handler';

import http from '@/src/utils/http';
import { LoadingScreen } from '../../common/LoadingScreen';

const ENDPOINT = '/admin/users';

type UserT = {
  phone: string;
  email: string;
  name: string;
  id: string;
  imageUrl: string | null;
};

export default function AdminUsersScreen() {
  const {
    data: users,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => http.get<UserT[]>(ENDPOINT),
    select: (res) => res?.data,
    retry: 1,
  });

  if (isFetching) {
    return <LoadingScreen />;
  }

  return (
    <>
      <ScrollView
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
        style={{ width: '100%' }}>
        <YStack p="$4" gap="$3">
          <Card justify="space-between" flex={1} padded bordered flexDirection="row">
            <Text color="gray">Total</Text>
            <Text>{users?.length ?? '0'}</Text>
          </Card>
          {users?.map((user) => {
            const initials = user.name
              ?.split(' ')
              .map((n) => n[0])
              .join('');

            return (
              <Card
                key={user.id}
                bordered
                pressStyle={{ opacity: 0.6 }}
                // onPress={() => router.push(`/admin/users/${user.id}`)}
                p="$4"
                gap="$3">
                <XStack items="center" gap="$3">
                  <Avatar size="$5" circular>
                    {user.imageUrl ? (
                      <Avatar.Image src={user.imageUrl} />
                    ) : (
                      <Avatar.Fallback>
                        <Text fontWeight="700">{initials}</Text>
                      </Avatar.Fallback>
                    )}
                  </Avatar>

                  <YStack>
                    <Text fontWeight="700" fontSize={16}>
                      {user.name}
                    </Text>
                    <Text color="gray" fontSize={13}>
                      {user.email}
                    </Text>
                  </YStack>
                </XStack>

                <Separator />

                <XStack justify="space-between">
                  <Text color="gray">Phone</Text>
                  <Text>{user.phone ?? 'N/A'}</Text>
                </XStack>
              </Card>
            );
          })}
        </YStack>
      </ScrollView>
    </>
  );
}
