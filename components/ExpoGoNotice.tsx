import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface ExpoGoNoticeProps {
  featureName: string;
}

export default function ExpoGoNotice({ featureName }: ExpoGoNoticeProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="information-circle" size={24} color={Colors.tertiary} />
      </View>
      <Text style={styles.text}>
        <Text style={styles.bold}>Expo Go Notice:</Text> {featureName} functionality is limited in Expo Go. 
        A mock implementation is being used for testing purposes.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    marginVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#FFF3CD',
    borderColor: '#FFEEBA',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  text: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#856404',
  },
  bold: {
    fontWeight: 'bold',
  },
});