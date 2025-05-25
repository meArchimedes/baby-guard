import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
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

export default function SetupScreen() {
  const [isScanning, setIsScanning] = useState(false);
  const [availableDevices, setAvailableDevices] = useState<CarDevice[]>([]);

  const startScanning = async () => {
    try {
      setIsScanning(true);
      setAvailableDevices([]);
      
      bleManager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.log("Error scanning for devices:", error);
          return;
        }
        
        if (device && device.name) {
          setAvailableDevices(prev => {
            if (!prev.some(d => d.id === device.id)) {
              return [...prev, { id: device.id, name: device.name || "Unknown Device" }];
            }
            return prev;
          });
        }
      });
      
      setTimeout(() => {
        bleManager.stopDeviceScan();
        setIsScanning(false);
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

  const selectCarDevice = async (device: CarDevice) => {
    try {
      const devices = [device];
      await AsyncStorage.setItem('carDevices', JSON.stringify(devices));
      await AsyncStorage.setItem('autoDetectionEnabled', 'true');
      await AsyncStorage.setItem('alwaysAssumeInCar', 'false');
      
      Alert.alert(
        "Setup Complete",
        "Your car's Bluetooth has been saved. BabyGuard will now monitor when you connect to this device.",
        [
          {
            text: "OK",
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (error) {
      console.error("Error saving car device:", error);
      Alert.alert("Error", "Failed to save car device. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Setup BabyGuard</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.subtitle}>
          Let's set up BabyGuard to work with your car's Bluetooth system
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Step 1</Text>
          <Text style={styles.cardText}>
            Make sure you're in or near your car and your car's Bluetooth is turned on and discoverable.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Step 2</Text>
          <Text style={styles.cardText}>
            Press the button below to scan for available Bluetooth devices.
          </Text>
          
          <TouchableOpacity
            style={[styles.button, isScanning && styles.buttonDisabled]}
            onPress={startScanning}
            disabled={isScanning}
          >
            <Text style={styles.buttonText}>
              {isScanning ? "Scanning..." : "Scan for Devices"}
            </Text>
            {isScanning && <ActivityIndicator color={Colors.white} style={styles.spinner} />}
          </TouchableOpacity>
        </View>

        {availableDevices.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Step 3</Text>
            <Text style={styles.cardText}>
              Select your car's Bluetooth system from the list below:
            </Text>
            
            {availableDevices.map(device => (
              <TouchableOpacity
                key={device.id}
                style={styles.deviceItem}
                onPress={() => selectCarDevice(device)}
              >
                <Ionicons name="bluetooth" size={20} color={Colors.primary} />
                <Text style={styles.deviceName}>{device.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.primary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.darkGray,
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: Colors.darkGray,
    marginBottom: 16,
  },
  button: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
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
  deviceItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  deviceName: {
    marginLeft: 8,
    fontSize: 16,
    color: Colors.black,
  },
});