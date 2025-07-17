import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Simple standalone app for Expo Go testing
export default function App() {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);

  // Mock devices
  const mockDevices = [
    { id: 'mock-device-1', name: 'Mock Car Device', rssi: -65 },
    { id: 'mock-device-2', name: 'Mock Baby Seat', rssi: -70 }
  ];

  // Simulate scanning
  const startScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setDevices(mockDevices);
      setIsScanning(false);
    }, 1500);
  };

  // Simulate connecting
  const connectToDevice = (deviceId) => {
    const device = devices.find(d => d.id === deviceId);
    setConnectedDevice(device);
  };

  // Render a device item
  const renderDevice = ({ item }) => {
    const isConnected = connectedDevice?.id === item.id;
    
    return (
      <TouchableOpacity
        style={styles.deviceCard}
        onPress={() => connectToDevice(item.id)}
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
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text style={styles.title}>BabyGuard - Expo Go Test</Text>
        <Text style={styles.subtitle}>Mock Bluetooth Implementation</Text>
      </View>
      
      <View style={styles.noticeContainer}>
        <Text style={styles.noticeText}>
          Bluetooth functionality is limited in Expo Go. A mock implementation is being used for testing purposes.
        </Text>
      </View>
      
      <TouchableOpacity
        style={styles.scanButton}
        onPress={startScan}
        disabled={isScanning}
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
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  noticeContainer: {
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#FFF3CD',
    borderColor: '#FFEEBA',
    marginBottom: 16,
  },
  noticeText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#856404',
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
  },
});