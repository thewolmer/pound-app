import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useSession } from '~/context/SessionContext';

async function registerForPushNotificationsAsync() {
	let token: Notifications.ExpoPushToken | undefined;

	if (Platform.OS === 'android') {
		Notifications.setNotificationChannelAsync('default', {
			name: 'default',
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: '#FF231F7C',
		});
	}

	if (Device.isDevice) {
		const { status: existingStatus } = await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		if (existingStatus !== 'granted') {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}
		if (finalStatus !== 'granted') {
			console.error('Push notification permission not granted');
			return '';
		}
		token = await Notifications.getExpoPushTokenAsync({
			projectId: Constants?.expoConfig?.extra?.eas.projectId,
		});
		console.log(token);
	} else {
		console.error('Must use physical device for Push Notifications');
	}

	return token?.data ?? '';
}

export const PushNotifications = () => {
	const { session } = useSession();
	useEffect(() => {
		registerForPushNotificationsAsync()
			.then(async (token) => {
				if (token && session?.user.id) {
					console.log('Updating push token for user', session?.user.id);
				}
			})
			.catch((error) => console.error(error));

		return () => {};
	}, [session?.user.id]);

	return null;
};
