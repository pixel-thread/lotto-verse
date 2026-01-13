import { useAuth } from '@/src/hooks/auth/useAuth';
import { useCurrentDraw } from '@/src/hooks/draw/useCurrentDraw';
import React from 'react';
import { YStack, Text, Card, Avatar, H1 } from 'tamagui';
import { LinearGradient } from 'tamagui/linear-gradient';

export function WinnerCard() {
  const { data } = useCurrentDraw();
  const winner = data?.winner;
  const { user } = useAuth();
  const isWinner = user?.id === winner?.userId;
  if (!winner) return null;

  return (
    <Card
      padding="$5"
      margin="$4"
      borderWidth={0}
      rounded="$8"
      alignSelf="center"
      overflow="hidden"
      bg="$background"
      bordered
      borderColor="$borderColor">
      {/* Gradient Accent Bar at top */}
      <LinearGradient
        colors={['#fff', '#000']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        height={6}
        width="100%"
        borderTopLeftRadius={16}
        borderTopRightRadius={16}
        position="absolute"
        z={-10}
      />

      <YStack
        width={'100%'}
        minW={'100%'}
        items="center"
        gap="$4"
        paddingBlockStart="$5"
        paddingBlockEnd="$6">
        <Text fontSize={28} fontWeight="900" letterSpacing={0.8}>
          🎉 Winner 🎉
        </Text>
        <Avatar circular size={150} borderWidth={4} elevation="$4">
          <Avatar.Image accessibilityLabel={`${winner.name}'s photo`} src={winner.imageUrl} />
          <Avatar.Fallback />
        </Avatar>

        <Text fontSize={22} fontWeight="900" maxW={280} ellipsizeMode="tail" numberOfLines={1}>
          {winner.name}
        </Text>

        <YStack
          rounded="$6"
          paddingBlock="$2"
          paddingInline="$4"
          items="center"
          gap="$1"
          minW={100}
          justify="center">
          <H1 fontWeight="900" letterSpacing={1}>
            {winner.number}
          </H1>
          {winner.email && <Text fontSize={16}>{winner.email}</Text>}
        </YStack>

        <YStack gap={10}>
          <Text fontSize={16} text="center" letterSpacing={0.8} color={'gray'}>
            Prize Pool
          </Text>
          <Text fontSize={24} text="center" letterSpacing={0.8} fontWeight="600">
            ₹&nbsp;{data.prize.amount}
          </Text>
        </YStack>
        {/* Contact Winner Section */}
        {isWinner && (
          <YStack
            gap="$2"
            paddingBlock="$4"
            paddingInline="$4"
            rounded="$6"
            bg="$backgroundFocus"
            width="100%"
            items="center"
            borderWidth={1}
            borderColor="$borderColorFocus">
            <Text fontSize={16} text={'center'} color="$color9">
              Please contact the number below for the prize.
            </Text>
            <Text fontSize={18} text={'center'} fontWeight={'500'}>
              +91 7085-566-834
            </Text>
          </YStack>
        )}

        {/* Contact Admin Section */}
      </YStack>
    </Card>
  );
}
