import React from 'react';
import { YStack, ScrollView } from 'tamagui';
import { DrawNumberSection } from './DrawNumberSection';
import { HowItWorkSection } from './HowItWorkSection';
import { DrawDetailCard } from './DrawDetailCard';
import { Stack } from 'expo-router';
import { CustomHeader } from '@components/common/CustomHeader';
import { drawRule } from '@/src/lib/constant/draw/drawRule';
import { useCurrentDraw } from '@/src/hooks/draw/useCurrentDraw';
import { NoActiveDraw } from './NoActiveDraw';

export function DrawScreen() {
  const { data: draw } = useCurrentDraw();

  if (!draw) {
    return <NoActiveDraw />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Luck Draw',
          headerShown: true,
          header: ({ back }) => <CustomHeader back={!!back} />,
        }}
      />
      <ScrollView
        flex={1}
        bg="$background"
        showsVerticalScrollIndicator={false}
        paddingBlockEnd={40}
        paddingInlineStart={32}
        paddingInline={20}>
        <YStack flex={1} gap="$3">
          <DrawDetailCard />
          <DrawNumberSection />
          <HowItWorkSection title="Rules" options={drawRule} />
        </YStack>
      </ScrollView>
    </>
  );
}
