import { CustomHeader } from '@/src/components/common/CustomHeader';
import UpdatesListScreen from '@/src/components/screen/admin/update';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Card } from 'tamagui';

const RightActions = () => {
  const router = useRouter();

  const onPressAddDraw = () => {
    router.push('/admin/updates/create');
  };
  return (
    <>
      <Card padding={'$2'} themeInverse>
        <TouchableOpacity hitSlop={4} onPress={onPressAddDraw}>
          <Ionicons name="add-outline" size={24} color="white" />
        </TouchableOpacity>
      </Card>
    </>
  );
};

export default function page() {
  return (
    <>
      <CustomHeader back={true} headerRight={<RightActions />} />
      <UpdatesListScreen />
    </>
  );
}
