// src/components/layout/MaxWidthContainer.tsx
import { View, StyleSheet } from 'react-native';
import React from 'react';

interface MaxWidthContainerProps {
  children: React.ReactNode;
  maxWidth?: number;
}

export const MaxWidthContainer = ({ children, maxWidth = 600 }: MaxWidthContainerProps) => {
  return (
    <View style={styles.center}>
      <View style={[styles.inner, { maxWidth }]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
  },
  inner: {
    flex: 1,
    width: '100%',
  },
});
