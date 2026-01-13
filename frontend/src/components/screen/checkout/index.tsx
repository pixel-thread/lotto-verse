import { useCurrentDraw } from '@/src/hooks/draw/useCurrentDraw';
import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { YStack, XStack, Text, Button, Card, H2, Separator, Avatar, Checkbox } from 'tamagui';
import { Link, useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import http from '@/src/utils/http';
import { useQueryClient } from '@tanstack/react-query';
import { PAYMENT_ENDPOINTS } from '@/src/lib/endpoints/payment';
import { toast } from 'sonner-native';
import RazorpayCheckout, { CheckoutOptions, SuccessResponse } from 'react-native-razorpay';
import { logger } from '@/src/utils/logger';
import { formatMonthWithTime } from '@/src/utils/helper/formatMonth';
import { useLuckyNumber } from '@/src/hooks/lucky-number/useLuckyNumber';
import { LoadingScreen } from '../../common/LoadingScreen';

type CheckoutPageProps = { id: string };

export function CheckoutPage({ id }: CheckoutPageProps) {
  const router = useRouter();
  const { data: draw, isFetching: isDrawFetching } = useCurrentDraw();
  const { user } = useUser();
  const { data: number, isFetching: isLuckyNumberFetching } = useLuckyNumber({ id });
  const queryClient = useQueryClient();
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const entryFee = draw?.entryFee || 0;
  const platformFee = (entryFee * 0.06).toFixed(2); // 6% platform fee
  const totalCost = (entryFee + parseFloat(platformFee)).toFixed(2);

  const { isPending: isVerifyFetching, mutate: mutateVerify } = useMutation({
    mutationFn: async (data: SuccessResponse) =>
      http.post<{ id: string }>(PAYMENT_ENDPOINTS.POST_VERYFY_PAYMENT, data),
    onSuccess: (data) => {
      if (data.success) {
        logger.log('Payment verified', { userId: user?.id });
        toast.success(`${data.message}, Redirecting`, {
          duration: 10000,
        });
        const id = data?.data?.id;
        queryClient.invalidateQueries({
          queryKey: ['current', 'luckyNumbers', 1],
        });
        router.push(`/draw/purchase/${id}`);
        return data;
      }
      toast.error(data.message);
      return data;
    },
  });

  const { isPending: isOptionFetching, mutate } = useMutation({
    mutationKey: ['payment', 'options'],
    mutationFn: () =>
      http.post<CheckoutOptions>(PAYMENT_ENDPOINTS.POST_CREATE_PAYMENT, { luckyNumberId: id }),
    onSuccess: (data) => {
      if (data?.success && data.data) {
        logger.log('Creating payment options', { userId: user?.id, luckyNumberId: id });
        const options: CheckoutOptions = {
          description: data.data.description,
          name: data.data.name,
          order_id: data.data.order_id,
          currency: data.data.currency,
          amount: data.data.amount,
          key: data.data.key,
        };

        logger.log('Opening Razorpay', { userId: user?.id, luckyNumberId: id });
        RazorpayCheckout.open(options)
          .then((data) => {
            logger.log('Payment went through', { userId: user?.id, luckyNumberId: id });
            mutateVerify(data);
            return data;
          })
          .catch((error) => {
            logger.error("Payment didn't go through", error);
            toast.error("Payment didn't go through", {
              duration: 10000,
            });
          });
        logger.log('Closing Razorpay', { userId: user?.id, luckyNumberId: id });
        return data.data;
      }
      toast.error(data.message);
      return data.data;
    },
  });

  const displayMonth = draw?.month;

  const declarationDate = formatMonthWithTime(draw?.endDate || '');

  const handleCheckout = async () => mutate();

  if (isDrawFetching || isLuckyNumberFetching) {
    return <LoadingScreen />;
  }

  return (
    <>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 50 }}>
        <YStack gap="$6" maxW={600} self="center" width="100%">
          {/* Header */}
          <YStack gap="$2">
            <H2 fontSize={28} fontWeight="900">
              Checkout
            </H2>
            <Text fontSize={15}>Review your order and complete your purchase</Text>
          </YStack>

          {/* Selected Number Card */}
          <Card
            padding="$5"
            themeInverse
            borderRadius="$6"
            borderWidth={2}
            borderColor="$borderColor"
            elevation="$10">
            <YStack gap="$4" items="center">
              <XStack items="center" gap="$2">
                <Text fontSize={14} fontWeight="700" textTransform="uppercase">
                  Your Lucky Number
                </Text>
              </XStack>
              <Text fontSize={56} fontWeight="900" letterSpacing={-2}>
                {number?.number}
              </Text>
              <Text fontSize={13}>This number is reserved for you during checkout</Text>
            </YStack>
          </Card>

          {/* Draw Details */}
          <Card padding="$4" borderRadius="$6" borderWidth={1} borderColor="$borderColor">
            <YStack gap="$3">
              <Text fontSize={16} fontWeight="700">
                Draw Information
              </Text>

              <XStack gap="$5" items="center">
                <Ionicons name="calendar-outline" size={18} color="$gray10" />
                <YStack gap={4} flex={1}>
                  <Text fontSize={13}>Draw Period</Text>
                  <Text fontSize={15} fontWeight="600">
                    {displayMonth}
                  </Text>
                </YStack>
              </XStack>

              <XStack gap="$5" items="center">
                <Ionicons name="trophy-outline" size={18} color="$green10" />
                <YStack gap={4} flex={1}>
                  <Text fontSize={13}>Prize Amount</Text>
                  <Text fontSize={15} fontWeight="600" color="$green11">
                    ₹{draw?.prize?.amount || 0}
                  </Text>
                </YStack>
              </XStack>

              <XStack gap="$5" items="center">
                <Ionicons name="checkmark-circle-outline" size={18} color="$gray10" />
                <YStack gap={4} flex={1}>
                  <Text fontSize={13}>Winner Announcement</Text>
                  <Text fontSize={15} fontWeight="600">
                    {declarationDate}
                  </Text>
                </YStack>
              </XStack>
            </YStack>
          </Card>

          {/* User Details */}
          <Card padding="$4" borderRadius="$6" borderWidth={1} borderColor="$borderColor">
            <YStack gap="$3">
              <Text fontSize={16} fontWeight="700">
                Your Details
              </Text>

              <XStack gap="$3" items="center">
                <Avatar circular size={40} borderWidth={1} borderColor="$borderColor">
                  <Avatar.Image src={user?.imageUrl} />
                  <Avatar.Fallback backgroundColor="$blue5" />
                </Avatar>
                <YStack flex={1}>
                  <Text fontSize={15} fontWeight="600">
                    {user?.fullName || user?.firstName + ' ' + user?.lastName || 'User'}
                  </Text>
                  <Text fontSize={13}>Account Holder</Text>
                </YStack>
              </XStack>

              <Separator borderColor="$borderColor" />

              <XStack gap="$3" items="center">
                <Ionicons name="mail-outline" size={20} />
                <Text fontSize={14}>{user?.primaryEmailAddress?.emailAddress || 'No email'}</Text>
              </XStack>

              {user?.primaryPhoneNumber?.phoneNumber && (
                <XStack gap="$3" items="center">
                  <Ionicons name="call-outline" size={20} />
                  <Text fontSize={14}>{user.primaryPhoneNumber.phoneNumber}</Text>
                </XStack>
              )}
            </YStack>
          </Card>

          {/* Price Breakdown */}
          <Card padding="$4" borderRadius="$6" borderWidth={1} borderColor="$borderColor">
            <YStack gap="$3">
              <Text fontSize={16} fontWeight="700">
                Price Breakdown
              </Text>

              <XStack justify="space-between" items="center">
                <Text fontSize={15}>Entry Fee</Text>
                <Text fontSize={15} fontWeight="600">
                  ₹{entryFee}
                </Text>
              </XStack>

              <XStack justify="space-between" items="center">
                <Text fontSize={15}>Platform Fee (2%)</Text>
                <Text fontSize={15} fontWeight="600">
                  ₹{platformFee}
                </Text>
              </XStack>

              <Separator borderColor="$borderColor" />

              <Card padding="$3" borderRadius="$5" borderWidth={1} themeInverse>
                <XStack justify="space-between" items="center">
                  <XStack items="center" gap="$2">
                    <Ionicons name="card-outline" size={18} color="white" />
                    <Text fontSize={16} fontWeight="700">
                      Total Amount
                    </Text>
                  </XStack>
                  <Text fontSize={22} fontWeight="900">
                    ₹{totalCost}
                  </Text>
                </XStack>
              </Card>
            </YStack>
          </Card>

          {/* Terms and Conditions */}
          <XStack gap="$3" items="flex-start" paddingInline="$2">
            <Checkbox
              size="$5"
              checked={agreeToTerms}
              onCheckedChange={(checked) => setAgreeToTerms(checked === true)}>
              <Checkbox.Indicator>
                <Ionicons name="checkmark-circle" size={22} />
              </Checkbox.Indicator>
            </Checkbox>
            <Link
              href={'/terms'}
              style={{
                paddingRight: 40,
              }}>
              I agree to the terms and conditions and confirm that I am 18 years or older.
            </Link>
          </XStack>

          {/* Action Buttons */}
          <YStack gap="$3" paddingBlockStart="$2">
            <Button
              size="$5"
              themeInverse
              disabled={!agreeToTerms || isOptionFetching}
              opacity={!agreeToTerms ? 0.5 : 1}
              onPress={handleCheckout}>
              <Text fontSize={16} fontWeight="700" color="white">
                {isOptionFetching
                  ? 'Processing...'
                  : isVerifyFetching
                    ? 'Redirecting...'
                    : `Pay ₹${totalCost}`}
              </Text>
            </Button>

            <Button size="$5" borderWidth={1} onPress={() => router.back()}>
              <Text fontSize={15} fontWeight="600">
                Go Back
              </Text>
            </Button>
          </YStack>

          {/* Security Note */}
          <Card themeInverse padding="$3" bordered>
            <Text fontSize={12} style={{ textAlign: 'center' }} lineHeight={18}>
              🔒 Secure payment powered by Razorpay. Your payment information is encrypted and
              secure.
            </Text>
          </Card>
        </YStack>
      </ScrollView>
    </>
  );
}
