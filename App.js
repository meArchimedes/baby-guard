import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Switch,
  Alert,
} from "react-native";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import AuthScreen from "./components/AuthScreen";
import firebaseApp from "./firebase"; // Import your Firebase app

export default function App() {
  const [user, setUser] = useState(null);
  const [babyInCar, setBabyInCar] = useState(false);
  const [bluetoothConnected, setBluetoothConnected] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(15);

  // Toggle Bluetooth connection (mock)
  const toggleBluetooth = () => {
    setBluetoothConnected(!bluetoothConnected);

    if (!bluetoothConnected) {
      // When connecting to Bluetooth
      setTimeout(() => {
        Alert.alert("Connected to Car", "Is your baby in the car?", [
          { text: "No", style: "cancel" },
          { text: "Yes", onPress: () => setBabyInCar(true) },
        ]);
      }, 500);
    } else if (babyInCar) {
      // When disconnecting with baby in car
      setShowCountdown(true);
    }
  };

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  // Handle countdown for baby check
  useEffect(() => {
    if (showCountdown && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showCountdown && countdown === 0) {
      Alert.alert(
        "ALERT: Check Your Baby!",
        "Please confirm you've taken your baby out of the car!",
        [
          {
            text: "Baby is out of the car",
            onPress: () => {
              setBabyInCar(false);
              setShowCountdown(false);
              setCountdown(15);
            },
          },
        ],
        { cancelable: false }
      );
    }
  }, [showCountdown, countdown]);


  // Reset countdown when confirmed
  const confirmBabyRemoved = () => {
    setBabyInCar(false);
    setShowCountdown(false);
    setCountdown(15);
  };

  if (!user) {
    return <AuthScreen />;
  }
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <Text style={styles.title}>BabyGuard</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.noticeContainer}>
          <Text style={styles.noticeText}>
            This is a simplified demo version of BabyGuard. In a real app,
            Bluetooth would connect automatically to your car.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Car Connection</Text>
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>Connected to Car</Text>
            <Switch
              value={bluetoothConnected}
              onValueChange={toggleBluetooth}
              trackColor={{ false: "#d3d3d3", true: "#2730d5" }}
              thumbColor={"#ffffff"}
            />
          </View>
          <Text style={styles.statusText}>
            {bluetoothConnected ? "Connected to Toyota Camry" : "Not connected"}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Baby Status</Text>
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>Baby in Car</Text>
            <Switch
              value={babyInCar}
              onValueChange={(value) => setBabyInCar(value)}
              trackColor={{ false: "#d3d3d3", true: "#2730d5" }}
              thumbColor={"#ffffff"}
              disabled={!bluetoothConnected}
            />
          </View>
          <Text style={styles.statusText}>
            {babyInCar ? "Baby is in the car" : "No baby in the car"}
          </Text>
        </View>

        {babyInCar && bluetoothConnected && (
          <View style={styles.alertCard}>
            <Text style={styles.alertText}>
              BabyGuard is monitoring. You'll be alerted when you disconnect
              from the car's Bluetooth.
            </Text>
          </View>
        )}
      </View>

      {showCountdown && (
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
                Yes, I've Taken My Baby Out
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
 
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#2730d5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  noticeContainer: {
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#FFF3CD",
    borderColor: "#FFEEBA",
    marginBottom: 16,
  },
  noticeText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#856404",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  alertCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  alertText: {
    fontSize: 14,
    color: "#333333",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2730d5",
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
    color: "#000000",
  },
  statusText: {
    fontSize: 14,
    color: "#666666",
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
  },
  countdownCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    width: "80%",
    alignItems: "center",
  },
  countdownTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2730d5",
    marginBottom: 16,
  },
  countdownText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 24,
    color: "#000000",
  },
  countdownNumber: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#eefb18",
    marginBottom: 24,
  },
  countdownButton: {
    backgroundColor: "#2730d5",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  countdownButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
