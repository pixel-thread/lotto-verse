import { useCurrentDraw } from '@/src/hooks/draw/useCurrentDraw';
import {
  View,
  Separator,
  Select,
  SelectProvider,
  Button,
  Sheet,
  Card,
  Text,
  XStack,
  Adapt,
  YStack,
  ScrollView,
} from 'tamagui';
import { SearchNumberTab } from '../draw/tabs/SearchNumberTab';
import { LuckyNumbersT } from '@/src/types/lucky-number';
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ADMIN_USER_ENDPOINTS } from '@/src/lib/endpoints/admin/users';
import http from '@/src/utils/http';
import { ADMIN_PURCHASE_ENDPOINTS } from '@/src/lib/endpoints/admin/purchase';
import { toast } from 'sonner-native';
import { Ionicons } from '@expo/vector-icons';

type UserT = {
  phone: string;
  email: string;
  name: string;
  id: string;
  imageUrl: string | null;
  isBanned: boolean;
  isLocked: boolean;
};
export const CreatePurchase = () => {
  const { data: ActiveDraw, isFetching } = useCurrentDraw();
  const [number, setNumber] = useState<LuckyNumbersT | null>(null);
  const [selectedUser, setSelectedUser] = useState<string>('');

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      http.post(ADMIN_PURCHASE_ENDPOINTS.POST_OFFLINE_PURCHASE, {
        luckyNumberId: number?.id,
        userId: selectedUser,
      }),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        return;
      }
      toast.error(data.message);
      return;
    },
  });

  const {
    data: users,
    isFetching: isFetchingUsers,
    refetch,
  } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => http.get<UserT[]>(ADMIN_USER_ENDPOINTS.GET_USERS),
    select: (data) => data?.data,
  });

  return (
    <ScrollView>
      <View p="$4" gap={'$5'}>
        <Card padding="$5" rounded="$8" bordered>
          <YStack gap="$2" items="center">
            <Text fontSize="$8" fontWeight="900">
              Offline Purchase
            </Text>
            <Text fontSize="$3" color="gray">
              Add a purchase for a selected user
            </Text>
          </YStack>
        </Card>

        <Card padding="$4" rounded="$6" bordered bg="$background">
          <YStack gap="$3">
            <XStack items="center" gap="$2">
              <Ionicons name="person-add-outline" size={18} />
              <Text fontSize="$4" fontWeight="700">
                Select User
              </Text>
            </XStack>
            <SelectProvider>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <Select.Trigger disabled={isFetchingUsers || isFetching} bg={'$background'}>
                  <Select.Value bg={'$background'} placeholder="Select a user..." />
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
                    <Select.Label>Select User</Select.Label>
                    {users &&
                      users?.map((item, i) => (
                        <Select.Item bordered key={item.id} value={item.id} index={i}>
                          <Select.ItemText fontWeight={'600'} fontSize="$4">
                            {item.email}
                          </Select.ItemText>
                        </Select.Item>
                      ))}
                  </Select.Viewport>
                  <Select.ScrollDownButton />
                </Select.Content>
              </Select>
            </SelectProvider>
          </YStack>
        </Card>

        <Card padding="$4" rounded="$6" bordered>
          <YStack gap="$4">
            <XStack items="center" gap="$2">
              <Ionicons name="search" size={18} />
              <Text fontSize="$4" fontWeight="700">
                Search Number
              </Text>
            </XStack>
            <SearchNumberTab draw={ActiveDraw} onNumberChange={(number) => setNumber(number)} />
          </YStack>
        </Card>

        <YStack>
          <Button
            size="$5"
            themeInverse={!!number && !!selectedUser}
            disabled={!selectedUser || !number || isPending}
            fontWeight={'600'}
            onPress={() => mutate()}>
            {isPending ? 'Adding...' : 'Add Purchase'}
          </Button>
        </YStack>
      </View>
    </ScrollView>
  );
};
