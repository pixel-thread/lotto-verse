import React from 'react';
import { ScrollView } from 'react-native';
import { YStack, XStack, Text, Card, Button, Separator } from 'tamagui';
import { Link, router } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import http from '@/src/utils/http';
import { RefreshControl } from 'react-native-gesture-handler';
import { formatMonth } from '@/src/utils/helper/formatMonth';
import { ADMIN_DRAW_ENDPOINTS } from '@/src/lib/endpoints/admin/draws';
import { DrawT } from '@/src/types/draw';
import { useAuth } from '@/src/hooks/auth/useAuth';
import { LoadingScreen } from '../../../common/LoadingScreen';
import { toast } from 'sonner-native';
import { EmptyCard } from '../../../common/EmptyCard';

export default function AdminDrawsScreen() {
  const { isSuperAdmin } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: draws,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['admin', 'draws'],
    queryFn: () => http.get<DrawT[]>(ADMIN_DRAW_ENDPOINTS.GET_ALL_DRAW),
    select: (res) => res.data,
    enabled: isSuperAdmin,
  });

  const onSuccess = (data: { success: boolean; message: string }) => {
    if (data.success) {
      queryClient.invalidateQueries({ queryKey: ['admin', 'draws'] });
      toast.success(data.message);
      return;
    }
    toast.error(data.message);
    return;
  };

  const { mutate: toggleActiveDraw, isPending } = useMutation({
    mutationKey: ['admin', 'draws'],
    mutationFn: (id: string) =>
      http.post(ADMIN_DRAW_ENDPOINTS.POST_TOGGLE_DRAW_ACTIVE.replace(':id', id)),
    onSuccess: onSuccess,
  });

  const { mutate: deleteDraw, isPending: isDeleting } = useMutation({
    mutationKey: ['admin', 'draws'],
    mutationFn: (id: string) =>
      http.post(ADMIN_DRAW_ENDPOINTS.DELETE_DRAW_BY_ID.replace(':id', id)),
    onSuccess: onSuccess,
  });

  const { mutate: declearWinner, isPending: isDeclearing } = useMutation({
    mutationKey: ['admin', 'draws'],
    mutationFn: (id: string) =>
      http.post(ADMIN_DRAW_ENDPOINTS.POST_DECLARE_DRAW_WINNER.replace(':id', id)),
    onSuccess: onSuccess,
  });

  const onToggleActive = (id: string) => toggleActiveDraw(id);

  const onDeleteDraw = (id: string) => {
    toast('Are you sure you want to delete this draw?', {
      action: {
        label: 'Yes',
        onClick: () => deleteDraw(id),
      },
    });
  };

  const onDeclareWinner = (id: string) => {
    toast('Are you sure you want to declare this draw?', {
      action: {
        type: 'destructive',
        label: 'Yes',
        onClick: () => declearWinner(id),
      },
    });
  };

  if (isFetching) {
    return <LoadingScreen />;
  }

  if (draws?.length === 0) {
    return (
      <YStack paddingBlock="$4" paddingInline={'$4'} gap="$4">
        <EmptyCard title="No Draws Found" message="You have not created any draws yet" />
      </YStack>
    );
  }

  return (
    <>
      <ScrollView
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
        style={{ width: '100%' }}>
        <YStack paddingBlock="$4" paddingInline={'$4'} gap="$4">
          {draws?.map((draw) => {
            return (
              <Card
                bordered
                key={draw.id}
                padding="$4"
                backgroundColor="$background"
                borderColor={draw.isActive ? '$green5' : '$borderColor'}
                gap="$3"
                borderRadius="$6">
                {/* “Table Header”-like row */}
                <Link href={`/draw/${draw.id}`} asChild>
                  <YStack gap="$2">
                    <XStack justify="space-between" items="center">
                      <Text textTransform="capitalize" fontWeight="700" fontSize={18}>
                        {draw.month} Draw
                      </Text>

                      <Text
                        fontSize={12}
                        fontWeight="600"
                        borderColor={draw.isActive ? '$green10' : '$red10'}
                        borderWidth={1}
                        paddingInline="$2"
                        paddingBlock="$1"
                        rounded="$4"
                        color={draw.isActive ? '$green10' : '$red10'}>
                        {draw.isActive ? 'Active' : 'Inactive'}
                      </Text>
                    </XStack>

                    <Separator marginBlock="$2" />

                    {/* Row 1 */}
                    <XStack justify="space-between">
                      <Text fontSize={14} fontWeight="600">
                        Prize
                      </Text>
                      <Text fontSize={14}>₹ {draw.prize.amount}</Text>
                    </XStack>

                    {/* Row 2 */}
                    <XStack justify="space-between" marginBlockStart="$2">
                      <Text fontSize={14} fontWeight="600">
                        Winner
                      </Text>
                      <Text fontSize={14}>{draw.winner?.name || 'Not Declared'}</Text>
                    </XStack>

                    {/* Row 3 */}
                    <XStack justify="space-between" marginBlockStart="$2">
                      <Text fontSize={14} fontWeight="600">
                        Declared On
                      </Text>
                      <Text fontSize={12}>{draw.winner?.createdAt || '-'}</Text>
                    </XStack>

                    {/* Row 4 */}
                    <XStack justify="space-between" marginBlockStart="$2">
                      <Text fontSize={14} fontWeight="600">
                        Entree Fee
                      </Text>
                      <Text fontSize={12}>{draw.entryFee || '-'}&nbsp;/-</Text>
                    </XStack>

                    <Separator marginBlock="$3" />
                  </YStack>
                </Link>
                {/* Admin Actions */}
                <XStack gap="$3">
                  <Button
                    onPress={() => onDeclareWinner(draw.id)}
                    themeInverse
                    disabled={isDeclearing}
                    flex={1}
                    size="$4">
                    <Button.Text textTransform="uppercase" fontWeight={'900'}>
                      {isDeclearing ? 'Declaring...' : 'Declare Winner'}
                    </Button.Text>
                  </Button>
                </XStack>

                <XStack gap="$3">
                  <Button
                    flex={1}
                    size="$4"
                    variant="outlined"
                    disabled={isPending}
                    onPress={() => onToggleActive(draw.id)}>
                    <Button.Text>
                      {isPending
                        ? draw.isActive
                          ? 'Deactivating...'
                          : 'Activating...'
                        : draw.isActive
                          ? 'Deactivate'
                          : 'Activated'}
                    </Button.Text>
                  </Button>

                  <Button
                    flex={1}
                    size="$4"
                    variant="outlined"
                    onPress={() => router.push(`/admin/draws/edit/${draw.id}`)}>
                    <Button.Text>Edit</Button.Text>
                  </Button>
                </XStack>
                <XStack gap="$3">
                  <Button
                    bg={'$red7'}
                    onPress={() => onDeleteDraw(draw.id)}
                    flex={1}
                    disabled={isDeleting}
                    size="$4">
                    <Button.Text color={'white'} textTransform="uppercase">
                      {isDeleting ? 'Deleting...' : 'Delete'}
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
