import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import BluetoothDeviceList from '../../components/BluetoothDeviceList';

export default function BluetoothScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        title: 'Bluetooth Devices',
        headerLargeTitle: true,
      }} />
      
      <View style={styles.headerContainer}>
        <Text style={styles.title}>
          Connect to your devices
        </Text>
        <Text style={styles.subtitle}>
          Pair with your car or baby seat to enable monitoring
        </Text>
      </View>
      
      <BluetoothDeviceList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000000',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 16,
    color: '#000000',
  },
});