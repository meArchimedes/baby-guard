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
  private connectedDeviceId: string | null = null;
  private mockDevices = [
    { id: 'mock-device-1', name: 'Toyota Camry', rssi: -65 },
    { id: 'mock-device-2', name: 'Honda Civic', rssi: -70 },
    { id: 'mock-device-3', name: 'Ford Explorer', rssi: -75 }
  ];

  async initialize(): Promise<void> {
    console.log('Initialized mock Bluetooth service');
    return Promise.resolve();
  }

  async scanForDevices(): Promise<any[]> {
    console.log('Mock scanning for devices');
    // Simulate a delay for scanning
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(this.mockDevices);
      }, 1500);
    });
  }

  async connectToDevice(deviceId: string): Promise<boolean> {
    console.log(`Mock connecting to device: ${deviceId}`);
    this.mockConnected = true;
    this.connectedDeviceId = deviceId;
    return Promise.resolve(true);
  }

  async disconnect(): Promise<void> {
    console.log('Mock disconnecting from device');
    this.mockConnected = false;
    this.connectedDeviceId = null;
    return Promise.resolve();
  }

  async isConnected(): Promise<boolean> {
    return Promise.resolve(this.mockConnected);
  }
  
  getConnectedDeviceId(): string | null {
    return this.connectedDeviceId;
  }
}

// For Expo Go, always use the mock implementation
// For development builds, we'll dynamically import the real implementation
let bluetoothService: BluetoothService = new MockBluetoothService();

// Export the mock service for now
export default bluetoothService;