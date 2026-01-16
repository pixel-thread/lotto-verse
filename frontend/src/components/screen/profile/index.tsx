import React from 'react';
import { RefreshControl } from 'react-native';
import { YStack, XStack, Text, ScrollView, Card, H1, Paragraph, Button, Avatar } from 'tamagui';
import { Link, Route, Stack } from 'expo-router';
import { CustomHeader } from '../../common/CustomHeader';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { LoadingScreen } from '../../common/LoadingScreen';
import { useLottoVerseUser } from '@/src/hooks/user/useLottoVerseUser';

type Items = {
  href: Route;
  label: string;
  isDisabled?: boolean;
};

const items: Items[] = [
  // {
  //   href: '/',
  //   label: 'Profile',
  //   isDisabled: true,
  // },
  {
    href: '/billing',
    label: 'Billing',
  },
  // {
  //   href: '/',
  //   label: 'Rules',
  //   isDisabled: true,
  // },
  // {
  //   href: '/',
  //   label: 'Help',
  //   isDisabled: true,
  // },
  // {
  //   href: '/',
  //   label: 'Settings',
  //   isDisabled: true,
  // },
  // {
  //   href: '/',
  //   label: 'About',
  //   isDisabled: true,
  // },
];

export function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();

  const { data: userData, refetch, isFetching: isLoading } = useLottoVerseUser();
  const onRefresh = () => refetch();

  if (isLoading || !user || !userData) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Profile',
            header: ({ back }) => <CustomHeader back={!!back} />,
            headerShown: true,
          }}
        />
        <LoadingScreen />
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Profile',
          header: ({ back }) => <CustomHeader back={!!back} />,
          headerShown: true,
        }}
      />
      <ScrollView
        flex={1}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
        paddingInline={'$4'}
        paddingBlock={'$4'}
        bg={'$background'}
        paddingBlockEnd={200}>
        <YStack gap="$3" items="center">
          <Card padding={'$2'} borderColor={'$borderColor'} elevate bordered rounded="$6">
            <Avatar rounded="$6" size={'$10'}>
              <Avatar.Image src={user.imageUrl} alt="avatar" />
            </Avatar>
          </Card>
          <H1 fontWeight="900" fontSize={36} color="$green10">
            {user?.username || user?.firstName}
          </H1>

          <Paragraph size="$6" color="gray" maxW={280}>
            {user?.primaryEmailAddress?.emailAddress}
          </Paragraph>

          <Paragraph size="$6" color="gray" maxW={280}>
            {user?.primaryPhoneNumber?.phoneNumber || 'N/A'}
          </Paragraph>

          <Card padding="$4" rounded="$6" borderWidth={1} borderColor="$borderColor" width="100%">
            <YStack gap="$2" items="center">
              <Text fontSize={12} color="gray" textTransform="uppercase" fontWeight="700">
                Member Since
              </Text>
              <Text fontSize={20} fontWeight="700">
                {userData.memberSince
                  ? new Date(userData?.memberSince).toLocaleDateString()
                  : 'N/A'}
              </Text>
            </YStack>
          </Card>

          <XStack justify="space-between" gap="$4" width="100%">
            <Card flex={1} padding="$4" rounded="$6" borderWidth={1} borderColor="$borderColor">
              <Text
                fontSize={12}
                color="gray"
                textTransform="uppercase"
                style={{ textAlign: 'center' }}
                fontWeight="700"
                mb={4}>
                Draws Participated
              </Text>
              <Text fontSize={24} fontWeight="900" style={{ textAlign: 'center' }}>
                {userData.totalDrawParticipate}
              </Text>
            </Card>
            <Card flex={1} padding="$4" rounded="$6" borderWidth={1} borderColor="$borderColor">
              <Text
                style={{ textAlign: 'center' }}
                fontSize={12}
                color="gray"
                textTransform="uppercase"
                fontWeight="700"
                mb={4}>
                Total Wins
              </Text>
              <Text fontSize={24} fontWeight="900" style={{ textAlign: 'center' }}>
                {userData.totalWin}
              </Text>
            </Card>
          </XStack>

          <Card padding="$4" rounded="$6" borderWidth={1} borderColor="$borderColor" width="100%">
            <YStack gap="$2" items="center">
              <Text fontSize={12} color="gray" textTransform="uppercase" fontWeight="700">
                Total Spent
              </Text>
              <H1 fontWeight="900" fontSize={36} color="$green10">
                ₹ {userData.totalDrawSpend}
              </H1>
            </YStack>
          </Card>

          {/* Buttons in rows - two per row */}
          <YStack width="100%" gap="$3">
            {items.map((item, i) => (
              <Link disabled={item.isDisabled} key={i} href={item.href} asChild>
                <Card padded borderWidth={1} borderColor="$borderColor">
                  <XStack width="100%" gap="$2" justify={'space-between'} items={'center'}>
                    <Text fontSize={16} fontWeight="700">
                      {item.label}
                    </Text>
                    <Ionicons name="chevron-forward" size={24} color="black" />
                  </XStack>
                </Card>
              </Link>
            ))}

            <XStack justify="space-between" gap="$3">
              <Button themeInverse onPress={() => signOut()} size="$6" flex={1}>
                <Button.Text fontWeight={'bold'}>Logout</Button.Text>
              </Button>
            </XStack>
          </YStack>
        </YStack>
      </ScrollView>
    </>
  );
}
