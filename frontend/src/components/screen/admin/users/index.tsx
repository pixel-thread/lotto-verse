import React from 'react';
import { ScrollView } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { YStack, XStack, Avatar, Text, Card, Separator, Button } from 'tamagui';
import { RefreshControl } from 'react-native-gesture-handler';

import http from '@/src/utils/http';
import { LoadingScreen } from '../../../common/LoadingScreen';
import { ADMIN_USER_ENDPOINTS } from '@/src/lib/endpoints/admin/users';
import { toast } from 'sonner-native';

type UserT = {
  phone: string;
  email: string;
  name: string;
  id: string;
  imageUrl: string | null;
  isBanned: boolean;
  isLocked: boolean;
};

export default function AdminUsersScreen() {
  const queryClient = useQueryClient();
  const {
    data: users,
    isFetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => http.get<UserT[]>(ADMIN_USER_ENDPOINTS.GET_USERS),
    select: (res) => res?.data,
    retry: 1,
  });

  const onSuccess = (data: { success: boolean; message: string }) => {
    if (data.success) {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success(data.message);
      return;
    }
    toast.error(data.message);
    return;
  };

  const { mutate: lockUser, isPending: isLocking } = useMutation({
    mutationFn: (id: string) => http.post(ADMIN_USER_ENDPOINTS.POST_LOCK_USER.replace(':id', id)),
    onSuccess,
  });

  const { mutate: banUser, isPending: isBanning } = useMutation({
    mutationFn: (id: string) => http.post(ADMIN_USER_ENDPOINTS.POST_BAN_USER.replace(':id', id)),
    onSuccess,
  });

  const onToggleBanned = (id: string) => {
    toast('Are you sure you want to BANNED this user?', {
      richColors: true,
      closeButton: true,
      description: 'This account will cause the user to be unable to login',
      action: {
        type: 'destructive',
        label: 'Yes',
        onClick: () => banUser(id),
      },
    });
  };

  const onToggleLocked = (id: string) => {
    toast('Are you sure you want to lock this user?', {
      closeButton: true,
      description: 'This account will cause the user to be unable to login',
      richColors: true,
      action: {
        type: 'destructive',
        label: 'Yes',
        onClick: () => lockUser(id),
      },
    });
  };

  if (isLoading) {
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

                <Separator />

                <XStack items={'center'} justify={'center'} gap={'$2'}>
                  <Button
                    disabled={isLocking}
                    onPress={() => onToggleBanned(user.id)}
                    variant={user.isBanned ? undefined : 'outlined'}
                    width={'50%'}
                    themeInverse={user.isBanned}>
                    <Button.Text>
                      {isBanning ? 'Banning' : user.isBanned ? 'Unban' : 'Ban'}
                    </Button.Text>
                  </Button>

                  <Button
                    disabled={isLocking}
                    themeInverse={user.isLocked}
                    variant={user.isLocked ? undefined : 'outlined'}
                    onPress={() => onToggleLocked(user.id)}
                    width={'50%'}>
                    <Button.Text>
                      {isLocking ? 'Locking' : user.isLocked ? 'Unlock' : 'Lock'}
                    </Button.Text>
                  </Button>
                </XStack>
              </Card>
            );
          })}
        </YStack>
      </ScrollView>
    </>
  );
}
