import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, useColorScheme } from 'react-native';
import { Spinner, View, Text, Card, Button } from 'tamagui';
interface Props {
  visible: boolean;
  title: string;
  message: string;
  loading?: boolean;
  onConfirm?: () => void;
}

export function UpdateDialog({ visible, title, message, loading, onConfirm }: Props) {
  const color = useColorScheme();
  const isDark = color === 'dark';
  return (
    <Modal transparent visible={visible}>
      <View
        rounded="$4"
        flex={1}
        justify="center"
        items="center"
        style={{
          backgroundColor: '#0006',
        }}>
        <Card
          paddingInline={'$5'}
          paddingBlock={'$5'}
          gap="$5"
          items="center"
          justify="center"
          flexDirection="column">
          <Card padded themeInverse>
            <Ionicons name="notifications-outline" size={30} color={isDark ? 'black' : 'white'} />
          </Card>
          <View justify="center">
            <Text text="center" fontSize={20} fontWeight="bold">
              {title}
            </Text>
            <Text maxW="80%" text="center" marginBlock={6}>
              {message}
            </Text>
          </View>

          {loading ? (
            <Spinner size="large" />
          ) : (
            onConfirm && (
              <Button size="$5" onPress={onConfirm} themeInverse>
                <Button.Text fontWeight={'bold'}>Continue</Button.Text>
              </Button>
            )
          )}
        </Card>
      </View>
    </Modal>
  );
}
