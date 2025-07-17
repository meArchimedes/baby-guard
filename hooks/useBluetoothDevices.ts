import { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import bluetoothService from '../services/bluetooth';

// Check if running in Expo Go
const isExpoGo = Constants.appOwnership === 'expo';

export interface BluetoothDevice {
  id: string;
  name?: string;
  rssi?: number;
}

export function useBluetoothDevices() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null);

  // Initialize Bluetooth
  useEffect(() => {
    const initializeBluetooth = async () => {
      try {
        await bluetoothService.initialize();
        setIsInitialized(true);
      } catch (error) {
        console.log('Bluetooth initialization error (mock):', error);
      }
    };

    initializeBluetooth();
  }, []);

  // Start scanning for devices
  const startScan = async () => {
    if (!isInitialized) {
      console.log('Bluetooth not initialized');
      return;
    }

    setIsScanning(true);
    try {
      const foundDevices = await bluetoothService.scanForDevices();
      setDevices(foundDevices);
    } catch (error) {
      console.log('Error scanning for devices (mock):', error);
    } finally {
      setIsScanning(false);
    }
  };

  // Connect to a device
  const connectToDevice = async (deviceId: string) => {
    try {
      const success = await bluetoothService.connectToDevice(deviceId);
      if (success) {
        const device = devices.find(d => d.id === deviceId);
        if (device) {
          setConnectedDevice(device);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.log('Error connecting to device (mock):', error);
      return false;
    }
  };

  // Disconnect from current device
  const disconnect = async () => {
    try {
      await bluetoothService.disconnect();
      setConnectedDevice(null);
    } catch (error) {
      console.log('Error disconnecting (mock):', error);
    }
  };

  // Check if connected to a device
  const checkConnection = async () => {
    try {
      const isConnected = await bluetoothService.isConnected();
      return isConnected;
    } catch (error) {
      console.log('Error checking connection (mock):', error);
      return false;
    }
  };

  return {
    isExpoGo: true, // Always treat as Expo Go for testing
    isInitialized,
    isScanning,
    devices,
    connectedDevice,
    startScan,
    connectToDevice,
    disconnect,
    checkConnection,
  };
}