import { useCurrentDraw } from '@/src/hooks/draw/useCurrentDraw';
import React from 'react';
import { YStack, Text, Card, Avatar, H1 } from 'tamagui';
import { LinearGradient } from 'tamagui/linear-gradient';

export function WinnerCard() {
  const { data } = useCurrentDraw();
  const winner = data?.winner;

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
      </YStack>
    </Card>
  );
}
