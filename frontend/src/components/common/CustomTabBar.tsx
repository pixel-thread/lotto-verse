import { TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, View } from 'tamagui';

export const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const windowWidth = Dimensions.get('window').width;
  const tabWidth = windowWidth / state.routes.length;
  const isIos = Platform.OS === 'ios';
  return (
    <View
      width="100%"
      paddingBlock={isIos ? '$2' : '$3'}
      borderTopWidth={0.5}
      borderTopColor="$borderColor"
      bg={'$background'}
      animation={'bouncy'}
      items={'center'}
      justify={'center'}
      animatePresence={true}
      flexDirection="row"
      style={[styles.container, { paddingBottom: isIos ? insets.bottom / 3 : 0 }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        // Get the tab icon from options
        const TabIcon = options.tabBarIcon;

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[styles.tab, { width: tabWidth }]}>
            <View style={styles.tabContent} gap={4}>
              {TabIcon &&
                TabIcon({
                  focused: isFocused,
                  color: isFocused ? '$blue10' : 'gray',
                  size: isFocused ? 20 : 24,
                })}
              {options.tabBarShowLabel && (
                <Text fontWeight={isFocused ? 'bold' : 'normal'}>{label.toString()}</Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    shadowOffset: { width: 0, height: 0 },
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
