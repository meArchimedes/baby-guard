import { getAuth, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import firebaseApp from "../firebase";
import EmergencyContactsScreen from "./EmergencyContactsScreen";
import PairedDevicesScreen from "./PairedDevicesScreen";

// Design System
const colors = {
  primary: "#1B365D",
  primaryLight: "#2A4A6B",
  secondary: "#FF6B6B",
  secondaryLight: "#FF8E8E",
  background: "#FFFFFF",
  backgroundSecondary: "#F8FAFC",
  backgroundTertiary: "#F1F5F9",
  textPrimary: "#0F172A",
  textSecondary: "#475569",
  textTertiary: "#94A3B8",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  gray100: "#F1F5F9",
  gray200: "#E2E8F0",
  gray300: "#CBD5E1",
};

export default function SettingsScreen({
  devices,
  setDevices,
  defaultBabyInCar,
  setDefaultBabyInCar,
  onBack,
}) {
  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);
  const user = auth.currentUser;
  const [notifications, setNotifications] = useState(true);
  const [showPairedDevices, setShowPairedDevices] = useState(false);
  const [autoConnect, setAutoConnect] = useState(true);
  const [showEmergencyContacts, setShowEmergencyContacts] = useState(false);
  const [emergencyContactsEnabled, setEmergencyContactsEnabled] =
    useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  if (showPairedDevices) {
    return (
      <PairedDevicesScreen
        devices={devices}
        setDevices={setDevices}
        onBack={() => setShowPairedDevices(false)}
      />
    );
  }

  if (showEmergencyContacts) {
    return (
      <EmergencyContactsScreen onBack={() => setShowEmergencyContacts(false)} />
    );
  }

  const handleSignOut = async () => {
    setIsSigningOut(true);

    // Show loading state for 1 second
    setTimeout(async () => {
      const auth = getAuth(firebaseApp);
      try {
        await signOut(auth);
        console.log("User signed out successfully");
      } catch (error) {
        setIsSigningOut(false);
        Alert.alert("Sign Out Error", error.message);
      }
    }, 1000);
  };

  const confirmSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", onPress: handleSignOut, style: "destructive" },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Safety Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety</Text>

          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Default Baby Status</Text>
                <Text style={styles.settingDescription}>
                  Assume baby is in car when connecting
                </Text>
              </View>
              <Switch
                value={defaultBabyInCar}
                onValueChange={setDefaultBabyInCar}
                trackColor={{ false: colors.gray200, true: colors.primary }}
                thumbColor={colors.background}
              />
            </View>
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Auto-Connect</Text>
                <Text style={styles.settingDescription}>
                  Automatically connect to known vehicles
                </Text>
              </View>
              <Switch
                value={autoConnect}
                onValueChange={setAutoConnect}
                trackColor={{ false: colors.gray200, true: colors.primary }}
                thumbColor={colors.background}
              />
            </View>
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>

          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Push Notifications</Text>
                <Text style={styles.settingDescription}>
                  Receive alerts when connection is lost
                </Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: colors.gray200, true: colors.primary }}
                thumbColor={colors.background}
              />
            </View>
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Emergency Contacts</Text>
                <Text style={styles.settingDescription}>
                  Alert emergency contacts if baby is left in car
                </Text>
              </View>
              <Switch
                value={emergencyContactsEnabled}
                onValueChange={setEmergencyContactsEnabled}
                trackColor={{ false: colors.gray200, true: colors.primary }}
                thumbColor={colors.background}
              />
            </View>
          </View>
        </View>

        {/* Device Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Devices</Text>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => setShowPairedDevices(true)}
          >
            <Text style={styles.actionLabel}>Manage Paired Vehicles</Text>
            <Text style={styles.actionDescription}>
              Add or remove vehicle connections
            </Text>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>

          {emergencyContactsEnabled && (
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => setShowEmergencyContacts(true)}
            >
              <Text style={styles.actionLabel}>Emergency Contacts</Text>
              <Text style={styles.actionDescription}>
                Configure emergency contact list
              </Text>
              <Text style={styles.actionArrow}>→</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionLabel}>Privacy Policy</Text>
            <Text style={styles.actionDescription}>
              View our privacy policy
            </Text>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionLabel}>Terms of Service</Text>
            <Text style={styles.actionDescription}>
              View terms and conditions
            </Text>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionCard,
              styles.dangerCard,
              isSigningOut && styles.disabledCard,
            ]}
            onPress={isSigningOut ? null : confirmSignOut}
            disabled={isSigningOut}
          >
            <Text style={[styles.actionLabel, styles.dangerText]}>
              {isSigningOut ? "Signing Out..." : "Sign Out"}
            </Text>
            <Text style={styles.actionDescription}>
              Sign out of your account
            </Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>BabyGuard v1.0.0</Text>
          <Text style={styles.footerText}>© 2024 BabyGuard Inc.</Text>
        </View>
      </ScrollView>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 20,
    color: colors.background,
    fontWeight: "600",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
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
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 16,
  },

  // Setting Cards
  settingCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 18,
  },

  // Action Cards
  actionCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.textPrimary,
    flex: 1,
  },
  actionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 2,
    marginRight: 12,
  },
  actionArrow: {
    fontSize: 16,
    color: colors.textTertiary,
    fontWeight: "600",
  },

  // Danger styling
  dangerCard: {
    borderWidth: 1,
    borderColor: colors.error,
  },
  dangerText: {
    color: colors.error,
  },
  disabledCard: {
    opacity: 0.6,
  },

  // Footer
  footer: {
    alignItems: "center",
    paddingVertical: 24,
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: colors.textTertiary,
    marginBottom: 4,
  },
});
