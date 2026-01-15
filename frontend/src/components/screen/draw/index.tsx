import React from 'react';
import { YStack, ScrollView } from 'tamagui';
import { HowItWorkSection } from './HowItWorkSection';
import { DrawDetailCard } from './DrawDetailCard';
import { Stack } from 'expo-router';
import { CustomHeader } from '@components/common/CustomHeader';
import { drawRule } from '@/src/lib/constant/draw/drawRule';
import { useCurrentDraw } from '@/src/hooks/draw/useCurrentDraw';
import { NoActiveDraw } from './NoActiveDraw';
import { WinnerCard } from '../home/WinnerCard';
import { SearchNumberTab } from './tabs/SearchNumberTab';
import { LoadingScreen } from '../../common/LoadingScreen';

export function DrawScreen() {
  const { data: draw, isLoading } = useCurrentDraw();

  if (draw?.isWinnerDecleared) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: true,
            header: ({ back }) => <CustomHeader back={!!back} />,
          }}
        />
        <ScrollView
          flex={1}
          bg="$background"
          paddingInline="$4"
          showsVerticalScrollIndicator={false}>
          <YStack gap={24} flex={1} width="100%">
            <WinnerCard />
            <HowItWorkSection title="Rules" options={drawRule} />
          </YStack>
        </ScrollView>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: true,
            header: ({ back }) => <CustomHeader back={!!back} />,
          }}
        />
        <LoadingScreen />
      </>
    );
  }

  if (!draw) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: true,
            header: ({ back }) => <CustomHeader back={!!back} />,
          }}
        />
        <NoActiveDraw />
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
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
          <SearchNumberTab />
          <HowItWorkSection title="Rules" options={drawRule} />
        </YStack>
      </ScrollView>
    </>
  );
}
