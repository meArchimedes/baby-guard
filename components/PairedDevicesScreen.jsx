import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Alert, SafeAreaView } from "react-native";

// Design System
const colors = {
  primary: '#1B365D',
  primaryLight: '#2A4A6B',
  secondary: '#FF6B6B',
  secondaryLight: '#FF8E8E',
  background: '#FFFFFF',
  backgroundSecondary: '#F8FAFC',
  backgroundTertiary: '#F1F5F9',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#94A3B8',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  gray100: '#F1F5F9',
  gray200: '#E2E8F0',
  gray300: '#CBD5E1',
};

// If you want to use real Bluetooth, import BleManager from 'react-native-ble-plx'
// import { BleManager } from "react-native-ble-plx";

export default function PairedDevicesScreen({ devices, setDevices, onBack }) {
  const [scanning, setScanning] = useState(false);
  const [foundDevices, setFoundDevices] = useState([]);

  // Mock scan for devices (replace with real scan for native)
  const handleScan = () => {
    setScanning(true);
    setFoundDevices([]);
    setTimeout(() => {
      setFoundDevices([
        { id: "car-1", name: "MyCar Audio" },
        { id: "car-2", name: "Family SUV" },
        { id: "car-3", name: "Tesla Model 3" },
      ]);
      setScanning(false);
    }, 2000);
  };

  const handleAddDevice = (device) => {
    if (devices.find((d) => d.id === device.id)) {
      Alert.alert("Already Paired", "This device is already in your paired list.");
      return;
    }
    setDevices([...devices, device]);
    Alert.alert("Device Added", `${device.name} has been added to your paired devices.`);
  };

  const handleRemoveDevice = (id) => {
    setDevices(devices.filter((d) => d.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Paired Devices</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connected Vehicles</Text>
          <FlatList
            data={devices}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>No paired devices</Text>
                <Text style={styles.emptySubtext}>Scan for nearby vehicles to get started</Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.deviceCard}>
                <Text style={styles.deviceName}>{item.name}</Text>
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => handleRemoveDevice(item.id)}
                >
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add New Vehicle</Text>
          
          <View style={styles.instructionCard}>
            <Text style={styles.instructionText}>
              Ensure your vehicle's Bluetooth is on and discoverable, then scan for nearby devices.
            </Text>
          </View>

          <TouchableOpacity 
            style={[styles.scanButton, scanning && styles.scanButtonDisabled]} 
            onPress={handleScan} 
            disabled={scanning}
          >
            <Text style={styles.scanButtonText}>
              {scanning ? "Scanning..." : "Scan for Vehicles"}
            </Text>
            {scanning && <ActivityIndicator size="small" color={colors.background} style={{ marginLeft: 8 }} />}
          </TouchableOpacity>
        </View>

        {foundDevices.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Devices</Text>
            <FlatList
              data={foundDevices}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.foundDeviceCard}
                  onPress={() => handleAddDevice(item)}
                >
                  <Text style={styles.deviceName}>{item.name}</Text>
                  <View style={styles.addButton}>
                    <Text style={styles.addText}>Add</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  
  // Header
  header: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: colors.background,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.background,
  },
  placeholder: {
    width: 40,
  },
  
  // Content
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  
  // Sections
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  
  // Device Cards
  deviceCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
    flex: 1,
  },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: colors.backgroundTertiary,
  },
  removeText: {
    color: colors.error,
    fontWeight: '500',
    fontSize: 14,
  },
  
  // Empty State
  emptyCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textTertiary,
  },
  
  // Instructions
  instructionCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  instructionText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  
  // Scan Button
  scanButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  scanButtonDisabled: {
    opacity: 0.7,
  },
  scanButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Found Devices
  foundDeviceCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.success,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  addButton: {
    backgroundColor: colors.success,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addText: {
    color: colors.background,
    fontWeight: '600',
    fontSize: 14,
  },
});