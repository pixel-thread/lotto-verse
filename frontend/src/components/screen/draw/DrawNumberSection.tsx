import React, { useState, useCallback } from 'react';
import { Paragraph, Button, Text, YStack, Card, Tabs, SizableText, Separator } from 'tamagui';
import { DrawNumberSectionSkeleton } from './skeleton/DrawNumberSkeleton';
import { useCurrentDraw } from '@/src/hooks/draw/useCurrentDraw';
import { router } from 'expo-router';
import { LuckyNumbersT } from '@/src/types/lucky-number';
import { SearchNumberTab } from './tabs/SearchNumberTab';
import { BrowseNumbersTab } from './tabs/BrowseNumberTab';

export const DrawNumberSection = () => {
  const [selectedNumber, setSelectedNumber] = useState<LuckyNumbersT | null>(null);
  const [userPurchasedNumber, setUserPurchasedNumber] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('tab1');

  const { isFetching: isDrawFetching, data: draw } = useCurrentDraw();

  const totalCost = selectedNumber ? draw?.entryFee : 0;

  const handleNumberChange = useCallback((number: LuckyNumbersT | null) => {
    setSelectedNumber(number);
  }, []);

  // Also wrap handleBuyNumbers
  const handleBuyNumbers = useCallback(() => {
    if (selectedNumber) {
      router.push(`/draw/checkout?number=${selectedNumber.number}&numberId=${selectedNumber.id}`);
    }
  }, [selectedNumber]);

  // Wrap tab change handler to clear selection
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
    setSelectedNumber(null);
  }, []);

  if (isDrawFetching) {
    return <DrawNumberSectionSkeleton />;
  }

  return (
    <Card>
      <YStack paddingInline="$3" paddingBlock="$3" rounded="$8" gap="$3">
        <Paragraph size="$8" fontWeight="700">
          Choose Your Lucky Number
        </Paragraph>
        <YStack gap="$2">
          <Paragraph size="$3" color="gray">
            Select one number from {draw?.startRange}-{draw?.endRange} • ₹{draw?.entryFee}
          </Paragraph>
          {userPurchasedNumber && (
            <Paragraph size="$3" fontWeight="600">
              ✓ You already have number #{userPurchasedNumber}
            </Paragraph>
          )}
        </YStack>

        {/* Tabs matching the demo design */}
        <Tabs
          defaultValue="tab1"
          value={activeTab}
          onValueChange={handleTabChange}
          orientation="horizontal"
          flexDirection="column"
          rounded="$4"
          borderWidth="$0.25"
          overflow="hidden"
          borderColor="$borderColor">
          <Tabs.List
            separator={<Separator vertical />}
            disablePassBorderRadius="bottom"
            aria-label="Choose number method">
            <Tabs.Tab
              focusStyle={{
                backgroundColor: '$color3',
              }}
              flex={1}
              themeInverse={activeTab === 'tab1'}
              value="tab1">
              <SizableText fontFamily="$body" fontWeight={'600'}>
                Browse Numbers
              </SizableText>
            </Tabs.Tab>
            <Tabs.Tab
              focusStyle={{
                backgroundColor: '$color3',
              }}
              flex={1}
              themeInverse={activeTab === 'tab2'}
              value="tab2">
              <SizableText fontWeight={'600'} fontFamily="$body">
                Search Number
              </SizableText>
            </Tabs.Tab>
          </Tabs.List>

          <Separator />

          {/* Browse Tab Content */}
          <TabsContent value="tab1">
            <BrowseNumbersTab onNumberChange={handleNumberChange} number={selectedNumber} />
          </TabsContent>

          {/* Search Tab Content */}
          <TabsContent value="tab2">
            <SearchNumberTab draw={draw} onNumberChange={handleNumberChange} />
          </TabsContent>
        </Tabs>

        {/* Buy Button */}
        <Button
          size="$5"
          rounded="$6"
          themeInverse={!!selectedNumber?.id}
          width="100%"
          fontWeight="700"
          height={56}
          marginBlockStart="$4"
          onPress={handleBuyNumbers}
          disabled={!selectedNumber || userPurchasedNumber !== null}>
          <Text fontSize="$5" fontWeight="700">
            {!selectedNumber
              ? 'Select a Number'
              : userPurchasedNumber
                ? 'Already Purchased'
                : `Buy #${selectedNumber.number} for ₹${totalCost}`}
          </Text>
        </Button>
      </YStack>
    </Card>
  );
};

// TabsContent component matching the demo
const TabsContent = (props: any) => {
  return (
    <Tabs.Content
      backgroundColor="$background"
      padding="$4"
      alignItems="center"
      justifyContent="center"
      flex={1}
      borderColor="$background"
      borderRadius="$2"
      borderTopLeftRadius={0}
      borderTopRightRadius={0}
      borderWidth="$2"
      {...props}>
      {props.children}
    </Tabs.Content>
  );
};
