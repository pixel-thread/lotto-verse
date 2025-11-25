import React from 'react';
import { ScrollView } from 'react-native';
import { Card, YStack, XStack, Text, Button, Paragraph, Separator } from 'tamagui';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ADMIN_UPDATE_ENDPOINTS } from '@/src/lib/endpoints/admin/updates';
import http from '@/src/utils/http';
import { UpdateReleaseT } from '@/src/types/update';
import { RefreshControl } from 'react-native-gesture-handler';
import { LoadingScreen } from '@/src/components/common/LoadingScreen';
import { Ternary } from '@/src/components/common/Ternary';
import { EmptyCard } from '@/src/components/common/EmptyCard';
import { toast } from 'sonner-native';

export default function UpdatesListScreen() {
  const {
    data: updates,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['admin', 'updates'],
    queryFn: () => http.get<UpdateReleaseT[]>(ADMIN_UPDATE_ENDPOINTS.GET_UPDATES),
    select: (res) => res.data,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) =>
      http.delete(ADMIN_UPDATE_ENDPOINTS.DELETE_UPDATE_BY_ID.replace(':id', id)),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        refetch();
        return;
      }
      toast.error(data.message);
      return;
    },
  });

  const onDeleteUpdate = (id: string) => {
    toast('Are you sure you want to delete this update?', {
      action: {
        type: 'destructive',
        label: 'Yes',
        onClick: () => mutate(id),
      },
      dismissible: true,
    });
  };

  if (isFetching) {
    return <LoadingScreen />;
  }

  return (
    <>
      <ScrollView refreshControl={<RefreshControl onRefresh={refetch} refreshing={isFetching} />}>
        <Ternary
          condition={!updates?.length}
          ifTrue={<EmptyCard title="No Updates" message="There are no updates at the moment." />}
          ifFalse={
            <YStack paddingInline="$4" paddingBlock={'$4'} gap="$4">
              {updates?.map((item) => (
                <Card key={item.id} bordered paddingInline="$4" paddingBlock={'$4'} gap="$5">
                  <XStack justify="space-between" items="center">
                    <Text fontWeight="bold">{item.releaseName || 'Unnamed Release'}</Text>
                  </XStack>

                  <Paragraph>Channel: {item.channel}</Paragraph>
                  <Paragraph>Type: {item.type}</Paragraph>
                  <Paragraph>Runtime: {item.runtimeVersion}</Paragraph>
                  <Paragraph>Mandatory: {item.isMandatory ? 'Yes' : 'No'}</Paragraph>
                  <Paragraph>Rollout: {item.rolloutPercent}%</Paragraph>
                  <Paragraph>Created: {item.createdAt}</Paragraph>
                  <Separator />
                  <Button
                    size="$4"
                    themeInverse
                    disabled={isPending}
                    onPress={() => onDeleteUpdate(item.id)}>
                    <Button.Text>Delete</Button.Text>
                  </Button>
                </Card>
              ))}
            </YStack>
          }
        />
      </ScrollView>
    </>
  );
}
