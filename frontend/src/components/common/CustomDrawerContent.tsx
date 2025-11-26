import { useAuth } from '@/src/hooks/auth/useAuth';
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
import { Button, View, Text, useTheme } from 'tamagui';

export type MenuItemsT = {
  id: number;
  title: string;
  herf: Route;
};

const menuItems: MenuItemsT[] = [
  { id: 1, title: 'Home', herf: '/' },
  { id: 2, title: 'Draws', herf: '/draw' },
  { id: 3, title: 'Rules', herf: '/terms' },
];

const adminDrawerMenuItems: MenuItemsT[] = [
  { id: 1, title: 'Home', herf: '/' },
  { id: 2, title: 'Draws', herf: '/admin/draws' },
  { id: 3, title: 'Transaction', herf: '/admin/transactions' },
  { id: 4, title: 'Winner', herf: '/admin/winners' },
  { id: 5, title: 'User', herf: '/admin/users' },
  { id: 6, title: 'Updates', herf: '/admin/updates' },
  { id: 7, title: 'Terms', herf: '/terms' },
];

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const { isSuperAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  let items: MenuItemsT[] = isSuperAdmin ? adminDrawerMenuItems : menuItems;
  return (
    <DrawerContentScrollView
      {...props}
      style={{
        backgroundColor: theme.background.val,
      }}
      contentContainerStyle={{
        paddingTop: insets.top,
        flex: 1,
      }}>
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
        {items.map((item) => {
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
