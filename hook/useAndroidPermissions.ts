// hooks/useAndroidPermissions.js
import { Platform, Alert, Linking } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export const useAndroidPermissions = () => {
  const requestMicrophonePermission = async () => {
    if (Platform.OS !== 'android') return true;

    try {
      // Check current permission status
      const status = await check(PERMISSIONS.ANDROID.RECORD_AUDIO);

      console.log('Microphone permission status:', status);

      if (status === RESULTS.GRANTED) {
        return true;
      }

      if (status === RESULTS.DENIED) {
        // Request permission
        const result = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
        console.log('Permission request result:', result);
        return result === RESULTS.GRANTED;
      }

      if (status === RESULTS.BLOCKED) {
        // Permission was denied permanently - show alert to go to settings
        Alert.alert(
          'Permission Required',
          'Microphone access is blocked. Please enable it in app settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => Linking.openSettings(),
            },
          ]
        );
        return false;
      }

      return false;
    } catch (error) {
      console.error('Permission error:', error);
      return false;
    }
  };

  return { requestMicrophonePermission };
};
