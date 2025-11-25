import React from 'react';
import { ScrollView } from 'react-native';
import {
  YStack,
  XStack,
  Text,
  Input,
  TextArea,
  Button,
  Label,
  Card,
  Form,
  Paragraph,
  Switch,
} from 'tamagui';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateSchema, UpdateFormT } from '@/src/utils/validation/update';
import { toast } from 'sonner-native';
import { Ternary } from '@/src/components/common/Ternary';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ADMIN_UPDATE_ENDPOINTS } from '@/src/lib/endpoints/admin/updates';
import http from '@/src/utils/http';

export default function CreateUpdateScreen() {
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: zodResolver(updateSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: UpdateFormT) => http.post(ADMIN_UPDATE_ENDPOINTS.POST_CREATE_UPDATE, data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ['admin', 'updates'] });
        router.replace('/admin/updates');
        return;
      }
      toast.error(data.message);
      return;
    },
  });

  const onSubmit = (data: UpdateFormT) => mutate(data);

  return (
    <>
      <ScrollView>
        <YStack paddingInline="$4" paddingBlock={'$4'} gap="$4">
          <Card bordered padding="$4" gap="$4">
            <Text fontWeight="700" fontSize="$10">
              Create Update
            </Text>

            <Form onSubmit={form.handleSubmit(onSubmit)}>
              {/* Channel */}
              <YStack gap="$2">
                <Label>Channel</Label>
                <Controller
                  name="channel"
                  control={form.control}
                  render={({ field }) => <Input {...field} placeholder="production/beta/dev" />}
                />

                {form.formState.errors.channel && (
                  <Paragraph color="red">{form.formState.errors.channel.message}</Paragraph>
                )}
              </YStack>

              {/* Runtime Version */}
              <YStack gap="$2">
                <Label>Runtime Version</Label>
                <Controller
                  name="runtimeVersion"
                  control={form.control}
                  render={({ field }) => <Input {...field} placeholder="1.0.0" />}
                />
              </YStack>

              {/* Release Name */}
              <YStack gap="$2">
                <Label>Release Name</Label>
                <Controller
                  name="releaseName"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      onChangeText={(value) => field.onChange(value)}
                      {...field}
                      placeholder="Release title"
                    />
                  )}
                />
                <Ternary
                  condition={!!form.formState?.errors?.releaseName?.message}
                  ifTrue={
                    <Paragraph color={'red'} paddingInline={'$3'}>
                      {form.formState?.errors?.releaseName?.message}
                    </Paragraph>
                  }
                  ifFalse={null}
                />
              </YStack>

              {/* Mandatory */}
              <YStack gap="$2">
                <Label>Mandatory?</Label>
                <Controller
                  name="isMandatory"
                  control={form.control}
                  render={({ field }) => (
                    <XStack items="center" gap="$3">
                      <Switch checked={!!field.value} onCheckedChange={(v) => field.onChange(v)} />
                      <Text>{field.value ? 'Yes' : 'No'}</Text>
                    </XStack>
                  )}
                />
              </YStack>

              {/* Rollout percent */}
              <YStack gap="$2">
                <Label>Rollout Percent</Label>
                <Controller
                  name="rolloutPercent"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      keyboardType="numeric"
                      value={field.value?.toString() || ''}
                      onChangeText={(v) => field.onChange(Number(v))}
                    />
                  )}
                />
              </YStack>

              {/* Releas Notes */}
              <YStack gap="$2">
                <Label>Release Notes</Label>
                <Controller
                  name="releaseNotes"
                  control={form.control}
                  render={({ field }) => (
                    <TextArea
                      onChangeText={(value) => field.onChange(value)}
                      minH={100}
                      {...field}
                      placeholder="Details about this update..."
                    />
                  )}
                />
              </YStack>

              <Form.Trigger disabled={isPending} asChild marginBlockStart="$4">
                <Button disabled={isPending} size="$5" themeInverse>
                  <Button.Text>Create Update</Button.Text>
                </Button>
              </Form.Trigger>
            </Form>
          </Card>
        </YStack>
      </ScrollView>
    </>
  );
}
