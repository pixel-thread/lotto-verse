import { Ionicons } from '@expo/vector-icons';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { Route, usePathname, useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, View, Text } from 'tamagui';

export type MenuItemsT = {
  id: number;
  title: string;
  herf: Route;
};

const menuItems: MenuItemsT[] = [
  { id: 1, title: 'Home', herf: '/' },
  { id: 2, title: 'Draws', herf: '/draw' },
];

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: insets.top, flex: 1 }}>
      <View paddingBlockEnd={'$2'}>
        <Text
          textTransform="uppercase"
          style={{ textAlign: 'center' }}
          fontWeight={'bold'}
          fontSize={'$8'}>
          {process.env.EXPO_PUBLIC_APP_NAME}
        </Text>
      </View>

      <DrawerItemList {...props} />
      <View gap="$2" flex={1} paddingBlockStart={'$5'} flexDirection="column">
        {menuItems.map((item) => {
          // Decide which item should carry the badge.
          // Here I’m showing it on the “Settings” item as an example:
          const isFocused = pathname === item.herf;
          const iconColors = isFocused
            ? isDarkMode
              ? 'black'
              : 'white'
            : isDarkMode
              ? 'white'
              : 'black';

          return (
            <View key={item.id} gap="$2" className="relative">
              <Button
                size={'$4'}
                variant={isFocused ? undefined : 'outlined'}
                iconAfter={<Ionicons name="chevron-forward" size={16} color={iconColors} />}
                themeInverse={pathname === item.herf}
                onPress={() => router.push(item.herf)}>
                <Button.Text
                  width={'100%'}
                  fontSize={'$3'}
                  fontWeight={'bold'}
                  style={{
                    textAlign: 'start',
                  }}>
                  {item.title}
                </Button.Text>
              </Button>
            </View>
          );
        })}
      </View>
    </DrawerContentScrollView>
  );
}
