import React, { Component, ReactNode } from 'react';
import { YStack, Text, Button, Card } from 'tamagui';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
  error?: Error;
};

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: undefined };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Here you can log error to monitoring services if needed
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <YStack flex={1} justify="center" items="center" paddingBlock="$6" paddingInline={'$6'}>
          <Card
            padding="$5"
            borderWidth={1}
            bordered
            padded
            bg="white"
            rounded="$8"
            maxWidth={320}
            gap={'$2'}>
            <YStack gap="$4" items="center">
              <Text fontSize={40} fontWeight="900" color="$red9" text="center">
                Oops!
              </Text>
              <Text fontSize={20} fontWeight="900" color="$red9" text="center">
                Something went wrong.
              </Text>
              <Text fontSize={16} color="$red8" text="center">
                {this.state.error?.message || 'An unexpected error occurred.'}
              </Text>
              <Button size="$4" bg="$red7" onPress={this.reset} maxW={160}>
                <Button.Text fontWeight="900" color="white" text="center">
                  Try Again
                </Button.Text>
              </Button>
            </YStack>
          </Card>
        </YStack>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
