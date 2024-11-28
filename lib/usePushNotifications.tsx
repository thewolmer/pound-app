import { useEffect } from 'react';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { Platform } from 'react-native';

export const registerForPushNotificationsAsync = async () => {
	let token: Notifications.ExpoPushToken | undefined;

	if (Platform.OS === 'android') {
		Notifications.setNotificationChannelAsync('default', {
			name: 'default',
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
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
		// await AsyncStorage.setItem('pushToken', token.data);
	} else {
		console.error('Must use physical device for Push Notifications');
	}

	return token?.data ?? '';
};

export const usePushNotifications = () => {
	Notifications.setNotificationHandler({
		handleNotification: async () => ({
			shouldShowAlert: true,
			shouldPlaySound: true,
			shouldSetBadge: false,
		}),
	});

	useEffect(() => {
		let isMounted = true;

		function redirect(notification: Notifications.Notification) {
			const url = notification.request.content.data?.url;
			if (url) {
				router.push(url);
			}
		}

		Notifications.getLastNotificationResponseAsync().then((response) => {
			if (!isMounted || !response?.notification) {
				return;
			}
			redirect(response?.notification);
		});

		const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
			redirect(response.notification);
		});

		return () => {
			isMounted = false;
			subscription.remove();
		};
	}, []);
};
