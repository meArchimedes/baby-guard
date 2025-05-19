import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const [autoDetectionEnabled, setAutoDetectionEnabled] = useState(true);
  const [backgroundMonitoring, setBackgroundMonitoring] = useState(true);
  const [notificationSound, setNotificationSound] = useState(true);

  // Load saved settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedAutoDetection = await AsyncStorage.getItem('autoDetectionEnabled');
        const savedBackgroundMonitoring = await AsyncStorage.getItem('backgroundMonitoring');
        const savedNotificationSound = await AsyncStorage.getItem('notificationSound');
        
        if (savedAutoDetection !== null) {
          setAutoDetectionEnabled(savedAutoDetection === 'true');
        }
        if (savedBackgroundMonitoring !== null) {
          setBackgroundMonitoring(savedBackgroundMonitoring === 'true');
        }
        if (savedNotificationSound !== null) {
          setNotificationSound(savedNotificationSound === 'true');
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    
    loadSettings();
  }, []);

  const saveSettings = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value.toString());
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const toggleAutoDetection = (value) => {
    setAutoDetectionEnabled(value);
    saveSettings('autoDetectionEnabled', value);
  };

  const toggleBackgroundMonitoring = (value) => {
    setBackgroundMonitoring(value);
    saveSettings('backgroundMonitoring', value);
  };

  const toggleNotificationSound = (value) => {
    setNotificationSound(value);
    saveSettings('notificationSound', value);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bluetooth Detection</Text>
          
          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingTitle}>Auto-Detection</Text>
              <Text style={styles.settingDescription}>
                Automatically prompt when Bluetooth connects to car
              </Text>
            </View>
            <Switch
              trackColor={{ false: Colors.lightGray, true: Colors.secondary }}
              thumbColor={Colors.white}
              ios_backgroundColor={Colors.lightGray}
              onValueChange={toggleAutoDetection}
              value={autoDetectionEnabled}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingTitle}>Background Monitoring</Text>
              <Text style={styles.settingDescription}>
                Monitor Bluetooth connections even when app is closed
              </Text>
            </View>
            <Switch
              trackColor={{ false: Colors.lightGray, true: Colors.secondary }}
              thumbColor={Colors.white}
              ios_backgroundColor={Colors.lightGray}
              onValueChange={toggleBackgroundMonitoring}
              value={backgroundMonitoring}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingTitle}>Alert Sound</Text>
              <Text style={styles.settingDescription}>
                Play sound with alert notifications
              </Text>
            </View>
            <Switch
              trackColor={{ false: Colors.lightGray, true: Colors.tertiary }}
              thumbColor={Colors.white}
              ios_backgroundColor={Colors.lightGray}
              onValueChange={toggleNotificationSound}
              value={notificationSound}
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
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  settingTitle: {
    fontSize: 16,
    color: Colors.black,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: Colors.darkGray,
    maxWidth: '80%',
  },
});