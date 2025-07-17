import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useBluetoothDevices, BluetoothDevice } from '../hooks/useBluetoothDevices';
import ExpoGoNotice from './ExpoGoNotice';

export default function BluetoothDeviceList() {
  const { 
    isInitialized, 
    isScanning, 
    devices, 
    connectedDevice,
    startScan, 
    connectToDevice 
  } = useBluetoothDevices();

  const handleConnect = async (deviceId: string) => {
    await connectToDevice(deviceId);
  };

  const renderDevice = ({ item }: { item: BluetoothDevice }) => {
    const isConnected = connectedDevice?.id === item.id;
    
    return (
      <TouchableOpacity
        style={[styles.deviceCard]}
        onPress={() => handleConnect(item.id)}
        disabled={isConnected}
      >
        <View style={styles.deviceInfo}>
          <Text style={styles.deviceName}>
            {item.name || 'Unknown Device'}
          </Text>
          <Text style={styles.deviceId}>ID: {item.id}</Text>
          {item.rssi && (
            <Text style={styles.rssi}>Signal: {item.rssi} dBm</Text>
          )}
        </View>
        <View style={styles.statusContainer}>
          {isConnected ? (
            <View style={styles.connectedBadge}>
              <Text style={styles.connectedText}>Connected</Text>
            </View>
          ) : (
            <Text style={styles.connectText}>Connect</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ExpoGoNotice featureName="Bluetooth" />
      
      <TouchableOpacity
        style={styles.scanButton}
        onPress={startScan}
        disabled={isScanning || !isInitialized}
      >
        {isScanning ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.scanButtonText}>
            Load Mock Devices
          </Text>
        )}
      </TouchableOpacity>

      {devices.length > 0 ? (
        <FlatList
          data={devices}
          renderItem={renderDevice}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            {isScanning 
              ? 'Scanning for devices...' 
              : 'No devices found. Tap the button to scan.'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  scanButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#007bff',
  },
  scanButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 16,
  },
  deviceCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#000000',
  },
  deviceId: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 2,
  },
  rssi: {
    fontSize: 12,
    opacity: 0.7,
  },
  statusContainer: {
    marginLeft: 8,
  },
  connectedBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#007bff',
  },
  connectedText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  connectText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007bff',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
    color: '#000000',
  },
});