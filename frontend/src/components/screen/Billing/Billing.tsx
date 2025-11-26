import React from 'react';
import { YStack, XStack, Text, Card, ScrollView, Circle, Separator } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import http from '@/src/utils/http';
import { USER_ENDPOINTS } from '@/src/lib/endpoints/user';
import { LoadingScreen } from '../../common/LoadingScreen';
import { getStatusColor } from '@/src/utils/helper/getStatusColor';
import { RefreshControl } from 'react-native-gesture-handler';
import { formatDate } from '@/src/utils/helper/formatDate';
import { router } from 'expo-router';
import { Pressable } from 'react-native';
import { EmptyCard } from '../../common/EmptyCard';
import { PurchaseT } from '@/src/types/purchase';

type Props = {
  purchase: PurchaseT;
  entryFeePerNumber?: number;
};

// Compact version for lists
export function BillingComponent({ purchase }: Props) {
  const hasWinningNumber =
    purchase.luckyNumber.some((num) => num.winnerId) && purchase.status === 'SUCCESS';

  return (
    <Pressable key={purchase.id} onPress={() => router.push(`/billing/${purchase.id}`)}>
      {({ pressed }) => (
        <Card
          padding="$4"
          rounded="$6"
          borderWidth={hasWinningNumber ? 2 : 1}
          borderColor={hasWinningNumber ? '$green10' : getStatusColor(purchase.status)}
          backgroundColor={hasWinningNumber ? '$green2' : 'white'}
          scale={pressed ? 0.98 : 1}>
          <YStack gap="$3">
            {/* Winner Badge */}
            {hasWinningNumber && (
              <XStack
                items="center"
                gap="$2"
                bg="$green10"
                paddingBlock="$3"
                paddingInline="$5"
                rounded="$4">
                <Ionicons name="trophy" size={16} color="white" />
                <Text fontSize={12} fontWeight="700" color="white">
                  WINNER!
                </Text>
              </XStack>
            )}

            {/* Header */}
            <XStack justify="space-between" items="center">
              <YStack gap="$1" flex={1}>
                <XStack items="center" gap="$2">
                  <Text fontSize={10} color="gray" textTransform="uppercase" fontWeight="700">
                    Receipt #{purchase.id.slice(-6)}
                  </Text>
                  <Circle size={6} bg={getStatusColor(purchase.status)} />
                </XStack>
                <Text fontSize={12} color="gray">
                  {formatDate(purchase.createdAt)}
                </Text>
              </YStack>
              <YStack items="flex-end" gap="$1">
                <Text fontSize={24} fontWeight="900" color={getStatusColor(purchase.status)}>
                  ₹{purchase.amount}
                </Text>
                <Card
                  padding="$1"
                  paddingHorizontal="$2"
                  rounded="$3"
                  backgroundColor={getStatusColor(purchase.status)}
                  opacity={0.9}>
                  <Text fontSize={10} fontWeight="700" color="white">
                    {purchase.status}
                  </Text>
                </Card>
              </YStack>
            </XStack>

            <Separator borderColor={getStatusColor(purchase.status)} />

            {/* Numbers Preview */}
            <YStack gap="$2">
              <XStack justify="space-between" items="center">
                <Text fontSize={12} color="gray" fontWeight="600">
                  Lucky Numbers ({purchase.luckyNumber.length})
                </Text>
                <XStack items="center" gap="$1">
                  <Text fontSize={11} color="$blue10" fontWeight="600">
                    View Details
                  </Text>
                  <Ionicons name="chevron-forward" size={14} color="#3b82f6" />
                </XStack>
              </XStack>
              <XStack gap="$2" flexWrap="wrap">
                {purchase.luckyNumber.slice(0, 6).map((num) => (
                  <Card
                    key={num.id}
                    padding="$2"
                    paddingHorizontal="$3"
                    rounded="$4"
                    backgroundColor={num.winnerId ? '$green10' : '$blue6'}
                    borderWidth={num.winnerId ? 2 : 1}
                    borderColor={num.winnerId ? '$green8' : '$blue8'}>
                    <XStack items="center" gap="$1">
                      <Text fontSize={16} fontWeight="800" color="white">
                        {num.number}
                      </Text>
                      {num.winnerId && <Ionicons name="trophy" size={12} color="white" />}
                    </XStack>
                  </Card>
                ))}
                {purchase.luckyNumber.length > 6 && (
                  <Card
                    padding="$2"
                    paddingHorizontal="$3"
                    rounded="$4"
                    backgroundColor="$background08"
                    borderWidth={1}
                    borderColor="gray">
                    <Text fontSize={14} fontWeight="700">
                      +{purchase.luckyNumber.length - 6}
                    </Text>
                  </Card>
                )}
              </XStack>
            </YStack>

            {/* Payment Method */}
            {purchase.paymentId && (
              <XStack items="center" gap="$2">
                <Ionicons name="card-outline" size={14} color="gray" />
                <Text fontSize={11} color="gray">
                  Payment ID: {purchase.paymentId.slice(-12)}
                </Text>
              </XStack>
            )}
          </YStack>
        </Card>
      )}
    </Pressable>
  );
}

// List component to show all purchases
export function Billing() {
  const {
    isFetching: isLoading,
    data: purchases,
    refetch,
  } = useQuery({
    queryFn: () => http.get<PurchaseT[]>(USER_ENDPOINTS.GET_RECENT_PURCHASES),
    queryKey: ['purchases'],
    select: (data) => data.data,
  });

  if (isLoading && !purchases) {
    return <LoadingScreen />;
  }

  if (!purchases || purchases.length === 0) {
    return (
      <EmptyCard
        title="No Purchases"
        message="You have not made any purchases yet."
        onRefresh={() => refetch()}
        isFetching={isLoading}
      />
    );
  }

  return (
    <ScrollView
      paddingBlock="$4"
      paddingInline="$4"
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
      showsVerticalScrollIndicator={false}>
      <YStack gap="$4">
        {/* Header Stats */}
        <Card padding="$4" rounded="$6" borderWidth={1} borderColor="$blue10" bg={'white'}>
          <XStack justify="space-between" items="center">
            <YStack gap="$1">
              <Text fontSize={12} color="gray" textTransform="uppercase" fontWeight="600">
                Total Purchases
              </Text>
              <Text fontSize={28} fontWeight="900">
                {purchases.length}
              </Text>
            </YStack>
            <YStack gap="$1" items="flex-end">
              <Text fontSize={12} color="gray" textTransform="uppercase" fontWeight="600">
                Total Spent
              </Text>
              <Text fontSize={28} fontWeight="900" color="$blue10">
                ₹{purchases.reduce((sum, p) => sum + p.amount, 0)}
              </Text>
            </YStack>
          </XStack>
        </Card>

        {/* Purchase List */}
        <YStack gap="$3">
          <XStack justify="space-between" items="center">
            <Text fontSize={16} fontWeight="700">
              Recent Purchases
            </Text>
            <Text fontSize={12} color="gray">
              Last {purchases.length} transactions
            </Text>
          </XStack>

          {purchases.map((purchase) => (
            <BillingComponent key={purchase.id} purchase={purchase} />
          ))}
        </YStack>
      </YStack>
    </ScrollView>
  );
}
