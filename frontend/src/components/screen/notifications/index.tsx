import React, { useState } from 'react';
import { RefreshControl } from 'react-native';
import { YStack, XStack, Text, ScrollView, Card, Button, Separator, Circle } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications } from '@/src/hooks/notifications/useNotifications';
import { Stack } from 'expo-router';
import { CustomHeader } from '../../common/CustomHeader';
import { Ternary } from '../../common/Ternary';
import { NotificationCardSkeleton, NotificationSkeleton } from './NotificationSkeleton';

type NotificationType = 'ALL' | 'IMPORTANT' | 'DRAW' | 'REWARD';

const NOTIFICATION_FILTERS: NotificationType[] = ['ALL', 'IMPORTANT', 'DRAW', 'REWARD'];

export function NotificationScreen() {
  const {
    data: notifications,
    isFetching: refreshing,
    isLoading,
    refetch: onRefresh,
  } = useNotifications();
  const [filter, setFilter] = useState<NotificationType>('ALL');

  const filtered =
    filter === 'ALL' ? notifications : notifications?.filter((n) => n.type === filter);

  if (isLoading) {
    return <NotificationSkeleton />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Notifications',
          headerShown: true,
          header: ({ back }) => <CustomHeader back={!!back} />,
        }}
      />
      <ScrollView
        flex={1}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        style={{ paddingHorizontal: 20 }}
        paddingBlockEnd={40}>
        <YStack gap="$2">
          {/* Filter Buttons */}
          <XStack justify="space-around" paddingBlockStart="$2" marginBlockEnd="$2">
            {NOTIFICATION_FILTERS.map((f) => (
              <Button
                key={f}
                size="$3"
                themeInverse={filter === f}
                disabled={filtered?.length === 0}
                rounded="$6"
                onPress={() => setFilter(f)}>
                <Text textTransform="capitalize">{f}</Text>
              </Button>
            ))}
          </XStack>

          <Separator />
          <Ternary
            condition={refreshing}
            ifTrue={
              <>
                {Array.from({ length: 5 }).map((_, i) => (
                  <NotificationCardSkeleton key={i} />
                ))}
              </>
            }
            ifFalse={
              <Ternary
                condition={filtered?.length === 0}
                ifFalse={
                  <YStack gap="$4">
                    {filtered?.map((notification) => (
                      <Card
                        key={notification.id}
                        padding="$4"
                        borderRadius="$6"
                        borderColor="$borderColor"
                        borderWidth={1}
                        themeInverse={!notification.isRead}
                        elevate>
                        <XStack justify="space-between" items="center" marginBlock="$2">
                          <XStack items="center" gap="$2">
                            <Ionicons
                              name={
                                notification.type === 'IMPORTANT'
                                  ? 'settings-outline'
                                  : notification.type === 'REWARD'
                                    ? 'gift-outline'
                                    : 'trophy-outline'
                              }
                              size={20}
                              color={notification.type === 'REWARD' ? '#FF9500' : '#007AFF'}
                            />
                            <Text fontSize={16} fontWeight="700">
                              {notification.title}
                            </Text>
                          </XStack>
                          {!notification.isRead && (
                            <Circle size={10} bg="$background" themeInverse />
                          )}
                        </XStack>

                        <Text fontSize={14} marginBlockEnd="$2">
                          {notification.message}
                        </Text>

                        <Text fontSize={12}>
                          {new Date(notification.createdAt).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Text>
                      </Card>
                    ))}
                  </YStack>
                }
                ifTrue={
                  <Card padded rounded="$true" bordered>
                    <YStack themeInverse items="center" paddingBlock="$10">
                      <Ionicons name="notifications-outline" size={48} color="gray" />
                      <Text fontSize={16} color="gray" marginBlockStart="$2">
                        No notifications yet.
                      </Text>
                    </YStack>
                  </Card>
                }
              />
            }
          />
        </YStack>
      </ScrollView>
    </>
  );
}
