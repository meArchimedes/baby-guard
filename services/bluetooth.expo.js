// Mock Bluetooth service for Expo Go
export class MockBluetoothService {
  constructor() {
    console.log('Using mock Bluetooth service for Expo Go');
    this.mockConnected = false;
    this.mockDevices = [
      { id: 'mock-device-1', name: 'Mock Car Device', rssi: -65 },
      { id: 'mock-device-2', name: 'Mock Baby Seat', rssi: -70 }
    ];
  }

  async initialize() {
    console.log('Initialized mock Bluetooth service');
    return Promise.resolve();
  }

  async scanForDevices() {
    console.log('Mock scanning for devices');
    return Promise.resolve(this.mockDevices);
  }

  async connectToDevice(deviceId) {
    console.log(`Mock connecting to device: ${deviceId}`);
    this.mockConnected = true;
    return Promise.resolve(true);
  }

  async disconnect() {
    console.log('Mock disconnecting from device');
    this.mockConnected = false;
    return Promise.resolve();
  }

  async isConnected() {
    return Promise.resolve(this.mockConnected);
  }
}

// Export a singleton instance
export const bluetoothService = new MockBluetoothService();
export default bluetoothService;