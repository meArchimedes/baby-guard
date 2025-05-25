import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BleManager } from "react-native-ble-plx";

const bleManager = new BleManager();

type CarDevice = {
  id: string;
  name: string;
};

export default function SettingsScreen() {
  const [isScanning, setIsScanning] = useState(false);
  const [carDevices, setCarDevices] = useState<CarDevice[]>([]);
  const [alwaysAssumeInCar, setAlwaysAssumeInCar] = useState(false);
  const [autoDetectionEnabled, setAutoDetectionEnabled] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedDevices = await AsyncStorage.getItem('carDevices');
      if (savedDevices) {
        setCarDevices(JSON.parse(savedDevices));
      }

      const assumeInCar = await AsyncStorage.getItem('alwaysAssumeInCar');
      setAlwaysAssumeInCar(assumeInCar === 'true');

      const autoDetect = await AsyncStorage.getItem('autoDetectionEnabled');
      setAutoDetectionEnabled(autoDetect !== 'false');
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const scanForNewDevice = async () => {
    try {
      setIsScanning(true);
      const newDevices: CarDevice[] = [];
      
      bleManager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.log("Error scanning for devices:", error);
          return;
        }
        
        if (device && device.name) {
          const deviceName = device.name || "Unknown Device";
          if (!newDevices.some(d => d.id === device.id) && 
              !carDevices.some(d => d.id === device.id)) {
            newDevices.push({ id: device.id, name: deviceName });
          }
        }
      });
      
      setTimeout(async () => {
        bleManager.stopDeviceScan();
        setIsScanning(false);
        
        if (newDevices.length > 0) {
          Alert.alert(
            "Select Car Bluetooth",
            "Select your car's Bluetooth system:",
            newDevices.map(device => ({
              text: device.name,
              onPress: () => addCarDevice(device),
            }))
          );
        } else {
          Alert.alert(
            "No New Devices",
            "No new Bluetooth devices found. Make sure your car's Bluetooth is on and discoverable."
          );
        }
      }, 15000);
    } catch (error) {
      console.error("Bluetooth error", error);
      setIsScanning(false);
      Alert.alert(
        "Bluetooth Error",
        "Please make sure Bluetooth is enabled and try again."
      );
    }
  };

  const addCarDevice = async (device: CarDevice) => {
    try {
      const updatedDevices = [...carDevices, device];
      await AsyncStorage.setItem('carDevices', JSON.stringify(updatedDevices));
      setCarDevices(updatedDevices);
      Alert.alert("Success", "Car Bluetooth device added successfully.");
    } catch (error) {
      console.error('Error adding car device:', error);
      Alert.alert("Error", "Failed to add car device.");
    }
  };

  const removeCarDevice = async (deviceId: string) => {
    try {
      const updatedDevices = carDevices.filter(d => d.id !== deviceId);
      await AsyncStorage.setItem('carDevices', JSON.stringify(updatedDevices));
      setCarDevices(updatedDevices);
    } catch (error) {
      console.error('Error removing car device:', error);
      Alert.alert("Error", "Failed to remove car device.");
    }
  };

  const toggleAlwaysAssumeInCar = async (value: boolean) => {
    try {
      await AsyncStorage.setItem('alwaysAssumeInCar', value.toString());
      setAlwaysAssumeInCar(value);
    } catch (error) {
      console.error('Error saving setting:', error);
    }
  };

  const toggleAutoDetection = async (value: boolean) => {
    try {
      await AsyncStorage.setItem('autoDetectionEnabled', value.toString());
      setAutoDetectionEnabled(value);
    } catch (error) {
      console.error('Error saving setting:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Car Bluetooth Devices</Text>
          {carDevices.map(device => (
            <View key={device.id} style={styles.deviceItem}>
              <View style={styles.deviceInfo}>
                <Ionicons name="bluetooth" size={20} color={Colors.primary} />
                <Text style={styles.deviceName}>{device.name}</Text>
              </View>
              <TouchableOpacity
                onPress={() => removeCarDevice(device.id)}
                style={styles.removeButton}
              >
                <Ionicons name="trash-outline" size={20} color={Colors.error} />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            style={[styles.button, isScanning && styles.buttonDisabled]}
            onPress={scanForNewDevice}
            disabled={isScanning}
          >
            <Text style={styles.buttonText}>
              {isScanning ? "Scanning..." : "Add New Car"}
            </Text>
            {isScanning && <ActivityIndicator color={Colors.white} style={styles.spinner} />}
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Auto-Detection</Text>
              <Text style={styles.settingDescription}>
                Automatically prompt when connecting to car Bluetooth
              </Text>
            </View>
            <Switch
              value={autoDetectionEnabled}
              onValueChange={toggleAutoDetection}
              trackColor={{ false: Colors.lightGray, true: Colors.secondary }}
              thumbColor={Colors.white}
            />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Always Assume Baby in Car</Text>
              <Text style={styles.settingDescription}>
                Skip prompt and always assume baby is in car when connecting
              </Text>
            </View>
            <Switch
              value={alwaysAssumeInCar}
              onValueChange={toggleAlwaysAssumeInCar}
              trackColor={{ false: Colors.lightGray, true: Colors.secondary }}
              thumbColor={Colors.white}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 16,
  },
  deviceItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  deviceInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  deviceName: {
    marginLeft: 8,
    fontSize: 16,
    color: Colors.black,
  },
  removeButton: {
    padding: 8,
  },
  button: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  spinner: {
    marginLeft: 8,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    color: Colors.black,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: Colors.darkGray,
  },
});