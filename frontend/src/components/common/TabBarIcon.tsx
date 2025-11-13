import Ionicons from '@expo/vector-icons/Ionicons';
import { useColorScheme } from 'react-native';

export const TabBarIcon = (props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  size?: number;
  focused?: boolean;
}) => {
  const { size = 24, focused = false, name } = props;
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  return (
    <Ionicons size={focused ? size + 2 : size} color={isDarkMode ? 'white' : 'black'} name={name} />
  );
};
