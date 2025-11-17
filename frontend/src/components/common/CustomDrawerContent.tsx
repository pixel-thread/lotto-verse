import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import { Route, usePathname, useRouter } from 'expo-router';
import { Image, View } from 'react-native';
import { useColorScheme } from 'nativewind';
import colors from 'tailwindcss/colors';
import React from 'react';
import { Text } from 'tamagui';

export type MenuItemsT = {
  id: number;
  title: string;
  herf: Route;
};

const menuItems: MenuItemsT[] = [
  { id: 1, title: 'Home', herf: '/' },
  { id: 2, title: 'Apostle Creed', herf: '/' },
  { id: 6, title: 'Tynrai Jingrwai', herf: '/' },
  { id: 3, title: 'Contact', herf: '/' },
  { id: 4, title: 'Report', herf: '/' },
  { id: 5, title: 'Settings', herf: '/' },
  { id: 7, title: 'Shaphang Jongngi', herf: '/' },
];

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const router = useRouter();
  const pathname = usePathname();

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0, flex: 1 }}>
      <View className="items-center p-4">
        {/* <Image */}
        {/*   source={require('~/assets/images/splashscreen/splashscreen.png')} */}
        {/*   style={{ width: 100, height: 100, borderRadius: 50 }} */}
        {/* /> */}
        <Text className="mt-5 uppercase" fontWeight={'bold'} fontSize={'$4'}>
          {process.env.EXPO_PUBLIC_APP_NAME}
        </Text>
      </View>

      <DrawerItemList {...props} />
      <>
        {menuItems.map((item) => {
          // Decide which item should carry the badge.
          // Here I’m showing it on the “Settings” item as an example:
          const showDot = item.title === 'Settings';
          return (
            <View key={item.id} className="relative">
              <DrawerItem
                focused={pathname === item.herf}
                label={item.title}
                onPress={() => router.push(item.herf)}
                labelStyle={{
                  textTransform: 'capitalize',
                  color: isDarkMode ? colors.gray[200] : colors.gray[950],
                  fontWeight: 'bold',
                }}
              />

              {showDot && (
                <View className="absolute right-4 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-red-500" />
              )}
            </View>
          );
        })}
      </>
    </DrawerContentScrollView>
  );
}
