import { CustomHeader } from '@/src/components/common/CustomHeader';
import { CustomTabBar } from '@/src/components/common/CustomTabBar';
import { TabBarIcon } from '@/src/components/common/TabBarIcon';
import { Tabs } from 'expo-router';

export default function Layout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false, tabBarShowLabel: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: (props) => (
            <TabBarIcon name={props.focused ? 'home' : 'home-outline'} {...props} />
          ),
          header: () => <CustomHeader />,
        }}
      />
      <Tabs.Screen
        name="(draw)/index"
        options={{
          title: 'Luck Draw',
          tabBarIcon: (props) => (
            <TabBarIcon name={props.focused ? 'dice' : 'dice-outline'} {...props} />
          ),
        }}
      />
      <Tabs.Screen
        name="(profile)/index"
        options={{
          title: 'Profile',
          tabBarIcon: (props) => (
            <TabBarIcon name={props.focused ? 'person' : 'person-outline'} {...props} />
          ),
        }}
      />
    </Tabs>
  );
}
