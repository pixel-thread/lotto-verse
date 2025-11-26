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
  Paragraph,
  Form,
} from 'tamagui';
import { Stack, router } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import http from '@/src/utils/http';
import { CustomHeader } from '@components/common/CustomHeader';
import { ADMIN_DRAW_ENDPOINTS } from '@/src/lib/endpoints/admin/draws';
import { createDrawSchema, CreateDrawSchemaT } from '@/src/utils/validation/draw';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ternary } from '../../../common/Ternary';
import { toast } from 'sonner-native';

export default function CreateDrawScreen() {
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(createDrawSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateDrawSchemaT) =>
      http.post<{ id: string }>(ADMIN_DRAW_ENDPOINTS.POST_CREATE_DRAW, data),
    onSuccess: (data) => {
      if (data.success) {
        router.replace(`/draw/${data?.data?.id}`);
        queryClient.invalidateQueries({ queryKey: ['admin', 'draws'] });
        toast.success(data.message);
        return;
      }
      toast.error(data.message);
      return;
    },
  });

  const onSubmit: SubmitHandler<CreateDrawSchemaT> = (data) => mutate(data);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Create Draw',
          headerShown: true,
          header: ({ back }) => <CustomHeader back={!!back} />,
        }}
      />

      <ScrollView style={{ width: '100%' }}>
        <YStack paddingBlock="$4" paddingInline="$4" gap="$4">
          <Card bordered padding="$4" gap="$4">
            {/* Month */}
            <XStack justify="space-between" items="center">
              <Text fontWeight="700" fontSize={'$10'}>
                Create Draw
              </Text>
            </XStack>

            <Form onSubmit={form.handleSubmit(onSubmit)}>
              <YStack gap="$2">
                <Label>Month (YYYY-MM)</Label>
                <Controller
                  name="month"
                  control={form.control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Input
                      onChangeText={(value) => field.onChange(value)}
                      placeholder="YYYY-MM"
                      {...field}
                    />
                  )}
                />

                <Ternary
                  condition={!!form.formState.errors.month?.message}
                  ifTrue={
                    <Paragraph color={'red'} paddingInline={'$3'}>
                      {form.formState.errors.month?.message}
                    </Paragraph>
                  }
                  ifFalse={null}
                />
              </YStack>

              {/* Range Start */}
              <YStack gap="$2">
                <Label>Start Range</Label>

                <Controller
                  name="startRange"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      value={field.value?.toString() || ''}
                      onChangeText={(value) => field.onChange(Number(value) || 0)}
                      onBlur={field.onBlur}
                      keyboardType="numeric"
                      placeholder="Start Range"
                    />
                  )}
                />

                <Ternary
                  condition={!!form.formState.errors.startRange?.message}
                  ifTrue={
                    <Paragraph color={'red'} paddingInline={'$3'}>
                      {form.formState.errors.startRange?.message}
                    </Paragraph>
                  }
                  ifFalse={null}
                />
              </YStack>

              {/* Range End */}
              <YStack gap="$2">
                <Label>End Range</Label>
                <Controller
                  name="endRange"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      value={field.value?.toString() || ''}
                      onChangeText={(value) => field.onChange(Number(value) || 0)}
                      onBlur={field.onBlur}
                      placeholder="End Range"
                      keyboardType="numeric"
                    />
                  )}
                />
                <Ternary
                  condition={!!form.formState.errors.endRange?.message}
                  ifTrue={
                    <Paragraph color={'red'} paddingInline={'$3'}>
                      {form.formState.errors.endRange?.message}
                    </Paragraph>
                  }
                  ifFalse={null}
                />
              </YStack>

              <YStack gap="$2">
                <Label>Fee</Label>
                <Controller
                  name="entryFee"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      value={field.value?.toString() || ''}
                      onChangeText={(value) => field.onChange(Number(value) || 0)}
                      onBlur={field.onBlur}
                      placeholder="End Range"
                      keyboardType="numeric"
                    />
                  )}
                />
                <Ternary
                  condition={!!form.formState.errors.endRange?.message}
                  ifTrue={
                    <Paragraph color={'red'} paddingInline={'$3'}>
                      {form.formState.errors.endRange?.message}
                    </Paragraph>
                  }
                  ifFalse={null}
                />
              </YStack>
              {/* Prize Amount */}
              <YStack gap="$2">
                <Label>Prize Amount</Label>

                <Controller
                  name="prize.amount"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      onChangeText={(value) => field.onChange(Number(value))}
                      keyboardType="numeric"
                      placeholder="Prize Amount"
                      value={field.value?.toString() || ''}
                    />
                  )}
                />
                <Ternary
                  condition={!!form.formState.errors.prize?.amount?.message}
                  ifTrue={
                    <Paragraph color={'red'} paddingInline={'$3'}>
                      {form.formState.errors.prize?.amount?.message}
                    </Paragraph>
                  }
                  ifFalse={null}
                />
              </YStack>

              {/* Prize Description */}
              <YStack gap="$2">
                <Label>Prize Description</Label>
                <Controller
                  name="prize.description"
                  control={form.control}
                  render={({ field }) => (
                    <TextArea
                      onChangeText={(value) => field.onChange(value)}
                      minH={100}
                      placeholder="Prize Description"
                      {...field}
                    />
                  )}
                />
                <Ternary
                  condition={!!form.formState.errors.prize?.description?.message}
                  ifTrue={
                    <Paragraph color={'red'} paddingInline={'$3'}>
                      {form.formState.errors.prize?.description?.message}
                    </Paragraph>
                  }
                  ifFalse={null}
                />
              </YStack>

              <YStack>
                <Form.Trigger asChild marginBlock="$4">
                  <Button size="$5" themeInverse disabled={isPending}>
                    <Button.Text>{isPending ? 'Creating...' : 'Create Draw'}</Button.Text>
                  </Button>
                </Form.Trigger>
              </YStack>
            </Form>
          </Card>
        </YStack>
      </ScrollView>
    </>
  );
}
