import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import { Platform } from 'react-native';

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        // Skip haptics for web platform
        if (Platform.OS === 'ios' || Platform.OS === 'android') {
          try {
            // Only try to use haptics on native platforms
            const Haptics = require('expo-haptics');
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          } catch (e) {
            // Ignore errors if haptics module isn't available
          }
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}