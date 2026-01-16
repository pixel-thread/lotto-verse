import React, { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';
import { Text, Form, ScrollView, Input, YStack, Button } from 'tamagui';
import { SheetWrapper } from './SheetWrapper';
import { useMutation } from '@tanstack/react-query';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema } from '@/src/utils/validation/user';
import http from '@/src/utils/http';
import { USER_ENDPOINTS } from '@/src/lib/endpoints/user';
import { useAuth } from '@/src/hooks/auth/useAuth';
import { useAuth as useCAuth } from '@clerk/clerk-expo';
import { toast } from 'sonner-native';

type FormData = {
  phoneNo: string;
};

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const ProfileUpdateSheet = ({}: Props) => {
  const [isSheetOpen, setIsShetOpen] = useState(false);
  const { isSignedIn } = useCAuth();
  const { user, isAuthLoading } = useAuth();

  const shouldOpenDialog = !user?.phoneNumber || user?.phoneNumber === '';

  const url = USER_ENDPOINTS.POST_UPDATE_USER.replace(':id', user?.id || '');

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => http.post(url, data),
    onSuccess: (data) => {
      if (data.success) {
        setIsShetOpen(false);
        toast.success(data.message, {
          position: 'top-center',
        });
        return data;
      }
      toast.error(data.message);
      return data;
    },
  });

  const form = useForm<FormData>({
    resolver: zodResolver(userSchema),
    defaultValues: { phoneNo: user?.phoneNumber || '' },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    Keyboard.dismiss();
    mutate(data);
  };

  const onClose = (value: boolean) => {
    setIsShetOpen(value);
    form.reset();
  };

  useEffect(() => {
    if (!isAuthLoading) {
      if (!!user && !user.phoneNumber) {
        if (user.phoneNumber === '' || user.phoneNumber === null || !user.phoneNumber) {
          setIsShetOpen(true);
        }
      }
    }
  }, [shouldOpenDialog, user, isAuthLoading]);

  if (!isSignedIn) {
    return null;
  }

  const isLoading = isPending || isAuthLoading;

  return (
    <SheetWrapper open={isSheetOpen} setOpen={onClose}>
      <ScrollView>
        <YStack gap="$5" flex={1} p="$2">
          <Text fontSize="$9" fontWeight="bold" text="center">
            Update Contact Number
          </Text>

          <Text fontSize="$5" text="center" color="$color11" lineHeight="$6">
            Enter your phone number to receive winner notifications and prize calls. We'll only
            contact you if you win!
          </Text>

          <Form gap="$3" onSubmit={form.handleSubmit(onSubmit)}>
            <Controller
              control={form.control}
              name="phoneNo"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <>
                  <Text fontSize="$5" fontWeight="bold" color="$color11" text="left">
                    Phone Number
                  </Text>

                  <Input
                    placeholder="e.g. +91 98765 43210"
                    keyboardType="phone-pad"
                    autoComplete="tel"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    {...(error && { helperText: error.message })}
                  />
                </>
              )}
            />

            {form.formState.errors.phoneNo && (
              <Text fontSize="$3" color="$red10" text="left">
                {form.formState.errors.phoneNo?.message}
              </Text>
            )}

            <Form.Trigger disabled={isLoading} asChild>
              <Button disabled={isLoading} size="$4" height="$5">
                {isPending ? 'Updating...' : 'Continue'}
              </Button>
            </Form.Trigger>
          </Form>
        </YStack>
      </ScrollView>
    </SheetWrapper>
  );
};
