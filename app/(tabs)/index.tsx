import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BleManager } from "react-native-ble-plx";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../firebase/firebase";

const bleManager = new BleManager();

type CarDevice = {
  id: string;
  name: string;
};

export default function HomeScreen() {
  const [babyInCar, setBabyInCar] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showCountdownScreen, setShowCountdownScreen] = useState(false);
  const [bluetoothConnected, setBluetoothConnected] = useState(false);
  const [autoDetectionEnabled, setAutoDetectionEnabled] = useState(true);
  const [alwaysAssumeInCar, setAlwaysAssumeInCar] = useState(false);
  const [carDevices, setCarDevices] = useState<CarDevice[]>([]);
  const [connectedCarDevice, setConnectedCarDevice] = useState<CarDevice | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const autoDetect = await AsyncStorage.getItem('autoDetectionEnabled');
        setAutoDetectionEnabled(autoDetect !== 'false');

        const assumeInCar = await AsyncStorage.getItem('alwaysAssumeInCar');
        setAlwaysAssumeInCar(assumeInCar === 'true');

        const savedDevices = await AsyncStorage.getItem('carDevices');
        if (savedDevices) {
          setCarDevices(JSON.parse(savedDevices));
        } else {
          router.replace('/setup');
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadSettings();
  }, []);

  useEffect(() => {
    if (carDevices.length === 0) return;

    const startMonitoring = () => {
      bleManager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.log("Error scanning for devices:", error);
          return;
        }
        
        if (device) {
          const carDevice = carDevices.find(d => d.id === device.id);
          if (carDevice) {
            setBluetoothConnected(true);
            setConnectedCarDevice(carDevice);
            
            if (autoDetectionEnabled && !babyInCar) {
              if (alwaysAssumeInCar) {
                setBabyInCar(true);
              } else {
                promptBabyStatus(carDevice.name);
              }
            }
          }
        }
      });
    };

    const monitoringInterval = setInterval(startMonitoring, 5000);
    startMonitoring();

    return () => {
      clearInterval(monitoringInterval);
      bleManager.stopDeviceScan();
    };
  }, [carDevices, autoDetectionEnabled, alwaysAssumeInCar, babyInCar]);

  useEffect(() => {
    if (!bluetoothConnected && babyInCar) {
      setCountdown(15);
      setShowCountdownScreen(true);
      const timer = setInterval(() => {
        setCountdown((prevCount) => {
          if (prevCount && prevCount <= 1) {
            clearInterval(timer);
            triggerAlarm();
            return 0;
          }
          return prevCount ? prevCount - 1 : 0;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [bluetoothConnected, babyInCar]);

  const promptBabyStatus = (deviceName: string) => {
    Alert.alert(
      "Connected to Car",
      `Connected to ${deviceName}. Is your baby in the car?`,
      [
        {
          text: "No",
          onPress: () => setBabyInCar(false),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => setBabyInCar(true),
        },
      ],
      { cancelable: true }
    );
  };

  const triggerAlarm = () => {
    Alert.alert(
      "ALERT: Check Your Baby!",
      "Please confirm you've taken your baby out of the car!",
      [
        {
          text: "I've Taken My Baby",
          onPress: () => {
            setBabyInCar(false);
            setShowCountdownScreen(false);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const confirmBabyRemoved = () => {
    setBabyInCar(false);
    setShowCountdownScreen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace("/signup");
    } catch (error) {
      Alert.alert("Error signing out", "Please try again");
    }
  };

  const toggleBabyStatus = () => {
    if (!babyInCar && !bluetoothConnected) {
      Alert.alert(
        "Bluetooth Not Connected",
        "Baby monitoring can only be activated when connected to your car's Bluetooth."
      );
      return;
    }
    setBabyInCar(!babyInCar);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>BabyGuard</Text>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
          <Ionicons name="log-out-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusIndicator,
              {
                backgroundColor: bluetoothConnected
                  ? Colors.success
                  : Colors.error,
              },
            ]}
          >
            <Ionicons
              name={bluetoothConnected ? "bluetooth" : "close-circle"}
              size={30}
              color="white"
            />
          </View>
          <Text style={styles.statusText}>
            {bluetoothConnected 
              ? `Connected to ${connectedCarDevice?.name}`
              : "Not Connected"}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Baby Status</Text>
          {bluetoothConnected ? (
            <>
              <View style={styles.toggleContainer}>
                <Text style={styles.toggleText}>Baby in Car</Text>
                <Switch
                  trackColor={{ false: Colors.lightGray, true: Colors.secondary }}
                  thumbColor={babyInCar ? Colors.white : Colors.white}
                  ios_backgroundColor={Colors.lightGray}
                  onValueChange={toggleBabyStatus}
                  value={babyInCar}
                />
              </View>
              <Text style={styles.statusDescription}>
                {babyInCar
                  ? "You have indicated that your baby is in the car"
                  : "You have indicated that your baby is not in the car"}
              </Text>
            </>
          ) : (
            <Text style={styles.statusDescription}>
              Connect to your car's Bluetooth to enable baby monitoring
            </Text>
          )}
        </View>

        {babyInCar && bluetoothConnected && (
          <View style={styles.alertCard}>
            <Ionicons
              name="information-circle"
              size={24}
              color={Colors.tertiary}
            />
            <Text style={styles.alertText}>
              BabyGuard is monitoring. You'll be alerted when you disconnect from
              the car's Bluetooth.
            </Text>
          </View>
        )}
      </ScrollView>

      {showCountdownScreen && (
        <View style={styles.countdownOverlay}>
          <View style={styles.countdownCard}>
            <Text style={styles.countdownTitle}>Drive Ended</Text>
            <Text style={styles.countdownText}>
              Did you take your baby out of the car?
            </Text>
            <Text style={styles.countdownNumber}>{countdown}</Text>
            <TouchableOpacity
              style={styles.countdownButton}
              onPress={confirmBabyRemoved}
            >
              <Text style={styles.countdownButtonText}>
                Yes, I've Taken My Baby
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.primary,
  },
  signOutButton: {
    padding: 8,
  },
  statusContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  statusIndicator: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.darkGray,
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
  alertCard: {
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  alertText: {
    fontSize: 14,
    color: Colors.black,
    marginLeft: 8,
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  toggleText: {
    fontSize: 16,
    color: Colors.black,
  },
  statusDescription: {
    fontSize: 14,
    color: Colors.darkGray,
    fontStyle: "italic",
  },
  countdownOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  countdownCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    width: "80%",
    alignItems: "center",
  },
  countdownTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 16,
  },
  countdownText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 24,
    color: Colors.black,
  },
  countdownNumber: {
    fontSize: 48,
    fontWeight: "bold",
    color: Colors.tertiary,
    marginBottom: 24,
  },
  countdownButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  countdownButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});