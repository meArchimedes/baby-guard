import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Check if running in Expo Go
const isExpoGo = Constants.appOwnership === 'expo';

// Interface for our Bluetooth service
export interface BluetoothService {
  initialize: () => Promise<void>;
  scanForDevices: () => Promise<any[]>;
  connectToDevice: (deviceId: string) => Promise<boolean>;
  disconnect: () => Promise<void>;
  isConnected: () => Promise<boolean>;
}

// Mock implementation for Expo Go and testing
class MockBluetoothService implements BluetoothService {
  private mockConnected: boolean = false;
  private mockDevices = [
    { id: 'mock-device-1', name: 'Mock Car Device', rssi: -65 },
    { id: 'mock-device-2', name: 'Mock Baby Seat', rssi: -70 }
  ];

  async initialize(): Promise<void> {
    console.log('Initialized mock Bluetooth service');
    return Promise.resolve();
  }

  async scanForDevices(): Promise<any[]> {
    console.log('Mock scanning for devices');
    return Promise.resolve(this.mockDevices);
  }

  async connectToDevice(deviceId: string): Promise<boolean> {
    console.log(`Mock connecting to device: ${deviceId}`);
    this.mockConnected = true;
    return Promise.resolve(true);
  }

  async disconnect(): Promise<void> {
    console.log('Mock disconnecting from device');
    this.mockConnected = false;
    return Promise.resolve();
  }

  async isConnected(): Promise<boolean> {
    return Promise.resolve(this.mockConnected);
  }
}

// For Expo Go, always use the mock implementation
// For development builds, we'll dynamically import the real implementation
let bluetoothService: BluetoothService = new MockBluetoothService();

// Export the mock service for now
export default bluetoothService;