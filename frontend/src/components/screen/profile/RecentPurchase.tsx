import React from 'react';
import { YStack, View, XStack, Text, Card, ScrollView, Circle, Separator, H2 } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { LoadingScreen } from '../../common/LoadingScreen';
import { EmptyCard } from '../../common/EmptyCard';
import { useQuery } from '@tanstack/react-query';
import { USER_ENDPOINTS } from '@/src/lib/endpoints/user';
import http from '@/src/utils/http';
import { RefreshControl } from 'react-native-gesture-handler';
import { Link, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type PurchaseT = {
  luckyNumber: {
    number: number;
    id: string;
    drawId: string;
    isPurchased: boolean;
    winnerId: string | null;
  }[];
  id: string;
  createdAt: Date;
  userId: string;
  luckyNumberId: string;
  razorpayId: string;
  paymentId: string | null;
  amount: number;
  drawId: string;
  status: string;
};

type Props = {
  purchases: PurchaseT[];
  isLoading?: boolean;
};

// Mock Purchase Data

const getStatusColor = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return 'green';
    case 'PENDING':
      return 'orange';
    case 'FAILED':
      return 'red';
    default:
      return 'gray';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return 'checkmark-circle';
    case 'PENDING':
      return 'time';
    case 'FAILED':
      return 'close-circle';
    default:
      return 'help-circle';
  }
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatTime = (date: Date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export function RecentPurchases() {
  const inset = useSafeAreaInsets();
  const {
    isFetching: isLoading,
    data: purchases,
    refetch,
  } = useQuery({
    queryFn: () => http.get<PurchaseT[]>(USER_ENDPOINTS.GET_RECENT_PURCHASES),
    queryKey: ['purchases'],
    select: (data) => data.data,
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!purchases || purchases.length === 0) {
    return (
      <View flex={1}>
        <EmptyCard
          isFetching={isLoading}
          onRefresh={refetch}
          title="No Purchases"
          message="You have not made any purchases yet."
        />
      </View>
    );
  }

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}>
      <YStack gap="$3" paddingBlock={10} paddingInline={5}>
        <XStack justify="space-between" paddingInline={20} flexDirection="column" items="center">
          <H2 fontWeight="700">Recent Purchases</H2>
          <Text fontSize={12} color="gray" fontWeight="600">
            {purchases.length} {purchases.length === 1 ? 'Purchase' : 'Purchases'}
          </Text>
        </XStack>

        <YStack gap="$3" paddingInline={5}>
          {purchases.map((purchase) => (
            <Card
              key={purchase.id}
              padding="$4"
              rounded="$6"
              bg="$background"
              borderWidth={1}
              borderColor={getStatusColor(purchase.status)}
              pressStyle={{ scale: 0.98 }}
              animation="quick">
              <Link asChild href={`/draw/purchase/${purchase.id}`}>
                <YStack gap="$3">
                  {/* Header with Status */}
                  <XStack justify="space-between" items="center">
                    <XStack items="center" gap="$2">
                      <Circle size={8} bg={getStatusColor(purchase.status)} />
                      <Text fontSize={12} color="gray" textTransform="uppercase" fontWeight="700">
                        Purchase #{purchase.id.slice(-6)}
                      </Text>
                    </XStack>
                    <XStack items="center" gap="$2">
                      <Ionicons
                        name={getStatusIcon(purchase.status) as any}
                        size={16}
                        color={getStatusColor(purchase.status)}
                      />
                      <Text fontSize={12} fontWeight="700" color={getStatusColor(purchase.status)}>
                        {purchase.status}
                      </Text>
                    </XStack>
                  </XStack>

                  {/* Lucky Numbers */}
                  {purchase.luckyNumber && purchase.luckyNumber.length > 0 && (
                    <YStack gap="$2">
                      <Text fontSize={12} color="gray" fontWeight="600">
                        Lucky Numbers
                      </Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={true} flex={1}>
                        <XStack gap="$2">
                          {purchase.luckyNumber.map((num) => (
                            <Card
                              key={num.id}
                              padding="$3"
                              rounded="$5"
                              backgroundColor={num.winnerId ? '$green10' : '$blue5'}
                              borderWidth={1}
                              borderColor={num.winnerId ? '$green8' : '$blue8'}>
                              <XStack items="center" gap="$2">
                                <Text
                                  fontSize={20}
                                  fontWeight="900"
                                  color={num.winnerId ? 'white' : '$blue11'}>
                                  {num.number}
                                </Text>
                                {num.winnerId && <Ionicons name="trophy" size={16} color="white" />}
                              </XStack>
                            </Card>
                          ))}
                        </XStack>
                      </ScrollView>
                    </YStack>
                  )}

                  <Separator borderColor="$borderColor" />

                  {/* Purchase Details */}
                  <XStack justify="space-between" items="center">
                    <YStack gap="$1">
                      <Text fontSize={12} color="gray" textTransform="uppercase" fontWeight="600">
                        Amount Paid
                      </Text>
                      <Text fontSize={24} fontWeight="900" color={getStatusColor(purchase.status)}>
                        ₹ {purchase.amount}
                      </Text>
                    </YStack>

                    <YStack gap="$1" items="flex-end">
                      <Text fontSize={12} color="gray" textTransform="uppercase" fontWeight="600">
                        Date & Time
                      </Text>
                      <Text fontSize={14} fontWeight="600">
                        {formatDate(purchase.createdAt)}
                      </Text>
                      <Text fontSize={12} color="gray">
                        {formatTime(purchase.createdAt)}
                      </Text>
                    </YStack>
                  </XStack>

                  {/* Payment IDs */}
                  {purchase.paymentId && (
                    <YStack gap="$1">
                      <Text fontSize={10} color="gray" textTransform="uppercase" fontWeight="600">
                        Payment ID
                      </Text>
                      <Text fontSize={12}>{purchase.paymentId}</Text>
                    </YStack>
                  )}
                </YStack>
              </Link>
            </Card>
          ))}
        </YStack>
      </YStack>
    </ScrollView>
  );
}
