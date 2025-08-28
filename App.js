import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  getAuth,
  onAuthStateChanged
} from "firebase/auth";
import { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import AuthScreen from "./components/AuthScreen";
import ForgotPasswordScreen from "./components/ForgotPasswordScreen";
import SettingsScreen from "./components/SettingsScreen";
import firebaseApp from "./firebase";

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

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [babyInCar, setBabyInCar] = useState(false);
  const [bluetoothConnected, setBluetoothConnected] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const [devices, setDevices] = useState([]);
  const [defaultBabyInCar, setDefaultBabyInCar] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const toggleBluetooth = () => {
    setBluetoothConnected(!bluetoothConnected);

    if (!bluetoothConnected) {
      setTimeout(() => {
        Alert.alert("Connected to Car", "Is your baby in the car?", [
          { text: "No", style: "cancel" },
          { text: "Yes", onPress: () => setBabyInCar(true) },
        ]);
      }, 500);
    } else if (babyInCar) {
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
            text: "Baby is Safe",
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

  const confirmBabyRemoved = () => {
    setBabyInCar(false);
    setShowCountdown(false);
    setCountdown(15);
  };

  if (!user) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  if(showSettings) {
    return(
      <SettingsScreen
        devices={devices}
        setDevices={setDevices}
        defaultBabyInCar={defaultBabyInCar}
        setDefaultBabyInCar={setDefaultBabyInCar}
        onBack={() => setShowSettings(false)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>BabyGuard</Text>
            <Text style={styles.subtitle}>Vehicle Safety Monitor</Text>
          </View>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => setShowSettings(true)}
          >
            <Text style={styles.settingsButtonText}>⚙</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Overview */}
        <View style={styles.statusOverview}>
          <View style={styles.statusCard}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Vehicle Connection</Text>
              <View style={[styles.statusIndicator, {
                backgroundColor: bluetoothConnected ? colors.success : colors.error
              }]} />
            </View>
            <Text style={styles.statusValue}>
              {bluetoothConnected ? "Connected" : "Disconnected"}
            </Text>
          </View>
          
          <View style={styles.statusCard}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Baby Status</Text>
              <View style={[styles.statusIndicator, {
                backgroundColor: babyInCar ? colors.warning : colors.success
              }]} />
            </View>
            <Text style={styles.statusValue}>
              {babyInCar ? "In Vehicle" : "Safe"}
            </Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={[styles.primaryButton, {
              backgroundColor: bluetoothConnected ? colors.error : colors.primary
            }]}
            onPress={toggleBluetooth}
          >
            <Text style={styles.primaryButtonText}>
              {bluetoothConnected ? "Disconnect" : "Connect Vehicle"}
            </Text>
          </TouchableOpacity>
          
          {bluetoothConnected && (
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => setBabyInCar(!babyInCar)}
            >
              <Text style={styles.secondaryButtonText}>
                {babyInCar ? "Mark Safe" : "Baby in Vehicle"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Active Monitoring */}
        {babyInCar && bluetoothConnected && (
          <View style={styles.alertCard}>
            <Text style={styles.alertTitle}>Monitoring Active</Text>
            <Text style={styles.alertText}>
              System is monitoring vehicle connection. Alert will trigger if connection is lost.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Emergency Alert */}
      {showCountdown && (
        <View style={styles.emergencyOverlay}>
          <View style={styles.emergencyCard}>
            <Text style={styles.emergencyTitle}>CONNECTION LOST</Text>
            <Text style={styles.emergencySubtitle}>
              Confirm baby safety
            </Text>
            <Text style={styles.countdownNumber}>{countdown}</Text>
            <TouchableOpacity
              style={styles.emergencyButton}
              onPress={confirmBabyRemoved}
            >
              <Text style={styles.emergencyButtonText}>
                BABY IS SAFE
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
    backgroundColor: colors.backgroundSecondary,
  },
  
  // Header
  header: {
    backgroundColor: colors.primary,
    paddingBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.background,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray300,
    marginTop: 2,
    fontWeight: '400',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsButtonText: {
    fontSize: 20,
    color: colors.background,
    fontWeight: '600',
  },
  
  // Content
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  
  // Status Overview
  statusOverview: {
    flexDirection: 'row',
    gap: 16,
    marginTop: -12,
    marginBottom: 32,
  },
  statusCard: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  statusValue: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  
  // Sections
  section: {
    marginBottom: 24,
  },
  
  // Buttons
  primaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  secondaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: colors.backgroundTertiary,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: colors.textPrimary,
  },
  
  // Alert Card
  alertCard: {
    backgroundColor: colors.success,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.background,
    marginBottom: 4,
  },
  alertText: {
    fontSize: 13,
    color: colors.background,
    lineHeight: 18,
    opacity: 0.9,
  },
  
  // Emergency Modal
  emergencyOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyCard: {
    backgroundColor: colors.background,
    borderRadius: 24,
    padding: 32,
    width: '90%',
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },

  emergencyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.error,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  emergencySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '400',
  },
  countdownNumber: {
    fontSize: 72,
    fontWeight: '700',
    color: colors.error,
    marginBottom: 32,
    textShadowColor: 'rgba(239, 68, 68, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  emergencyButton: {
    backgroundColor: colors.success,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  emergencyButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});