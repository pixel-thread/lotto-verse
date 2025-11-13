import { Link, usePathname, useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Platform, TouchableOpacity } from 'react-native';
import colors from 'tailwindcss/colors';
import type { ReactNode } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Button, View, Card } from 'tamagui';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  back?: boolean;
  headerLeft?: ReactNode;
  headerRight?: ReactNode;
};

export const CustomHeader: React.FC<Props> = ({ back, headerRight }) => {
  const router = useRouter();
  const pathName = usePathname();
  const isNotification = pathName === '/notifications';
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const onPressBackButton = () => router.back();

  return (
    <View
      flexDirection="row"
      items="center"
      justify="space-between"
      bg={'$background'}
      height={60}
      width="100%"
      style={{
        paddingLeft: insets.left + 9,
        paddingRight: insets.right + 9,
      }}>
      <View flexDirection="row" justify={'flex-start'} items="center" flex={1} height="100%">
        {back && (
          <Card padding={'$2'} themeInverse>
            <TouchableOpacity
              onPress={onPressBackButton}
              style={{ alignItems: 'center', justifyContent: 'center' }}>
              {Platform.OS === 'ios' ? (
                <MaterialCommunityIcons
                  size={25}
                  name="chevron-left"
                  color={isDarkMode ? colors.black : colors.white}
                />
              ) : (
                <MaterialCommunityIcons
                  size={20}
                  name="arrow-left"
                  color={isDarkMode ? colors.black : colors.white}
                />
              )}
            </TouchableOpacity>
          </Card>
        )}
      </View>

      <View flexDirection="row" gap="$2" items="center" justify="flex-end" flex={1}>
        {headerRight}
        {!isNotification && !back && (
          <Card rounded={'$true'} themeInverse padding={'$2'}>
            <Link href="/notifications">
              <Ionicons
                name="notifications-outline"
                color={isDarkMode ? 'black' : 'white'}
                size={25}
              />
            </Link>
          </Card>
        )}
      </View>
    </View>
  );
};
