import { Ionicons } from '@expo/vector-icons';
import { View, Paragraph, H2, Button, Card, Spinner } from 'tamagui';

type Props = {
  title?: string;
  message?: string;
  onRefresh?: () => void;
  isFetching?: boolean;
};
export const EmptyCard = ({
  title = 'No Data',
  message = 'This is a demo message',
  onRefresh,
  isFetching,
}: Props) => {
  return (
    <View flex={1} paddingInline={20} marginBlockStart={20}>
      <Card bg="$background" padded bordered height={'100%'}>
        <View flex={1} items="center" justify="center" gap="$5">
          <View>
            <Ionicons name="notifications-outline" size={100} color="black" />
          </View>
          <View gap="$3">
            <H2 text={'center'} fontWeight={'bold'}>
              {title}
            </H2>
            <Paragraph text="center">{message}</Paragraph>
            <Button themeInverse size="$6" disabled={isFetching} onPress={onRefresh}>
              {isFetching ? <Spinner size="small" /> : 'Refresh'}
            </Button>
          </View>
        </View>
      </Card>
    </View>
  );
};
