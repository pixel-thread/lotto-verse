import { CustomHeader } from '@/src/components/common/CustomHeader';
import AdminEditDrawScreen from '@/src/components/screen/admin/draws/EditDrawScreen';
import { Stack, useLocalSearchParams } from 'expo-router';

export default function EditDraw() {
  const { id } = useLocalSearchParams();
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Create Draw',
          headerShown: true,
          header: ({ back }) => <CustomHeader back={!!back} />,
        }}
      />
      <AdminEditDrawScreen id={id.toString()} />
    </>
  );
}
