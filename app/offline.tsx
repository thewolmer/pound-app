import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useIsOffline } from '~/hooks/useIsOffline';

export default function OfflineScreen() {
	const isOffline = useIsOffline();

	useEffect(() => {
		if (isOffline) {
			router.replace('/auth');
		}
	}, [isOffline]);
	return (
		<View className="flex-1 items-center justify-center">
			<Text className="text-destructive-foreground">You're Offline. Please check your network connection.</Text>
		</View>
	);
}
