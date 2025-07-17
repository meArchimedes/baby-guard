import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ExpoGoNoticeProps {
  featureName: string;
}

export default function ExpoGoNotice({ featureName }: ExpoGoNoticeProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {featureName} functionality is limited in Expo Go. A mock implementation is being used for testing purposes.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#FFF3CD',
    borderColor: '#FFEEBA',
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: '#856404',
  },
});