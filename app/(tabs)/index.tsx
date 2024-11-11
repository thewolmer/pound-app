import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AccountBalance } from '~/components/account-balance';
import { TabBarIcon } from '~/components/icons/TabBarIcon';
import { LatestTransactions } from '~/components/latest-transactions';
import { useSession } from '~/context/SessionContext';
import { supabase } from '~/lib/supabase';
import { registerForPushNotificationsAsync } from '~/lib/usePushNotifications';

export default function StartScreen() {
	const { session } = useSession();

	// biome-ignore lint/correctness/useExhaustiveDependencies: I want to run it only once
	useEffect(() => {
		const registerForPushNotifications = async () => {
			const token = await registerForPushNotificationsAsync();
			if (token) {
				const tokenFromLocalStorage = await AsyncStorage.getItem('pushToken');
				if (tokenFromLocalStorage !== token) {
					const { data, error } = await supabase
						.from('expo_push_token')
						.insert({
							expo_push_token: token,
							person_id: session?.user.id,
						})
						.select();
					if (data) {
						await AsyncStorage.setItem('pushToken', token);
					}
				}
			}
		};

		registerForPushNotifications();
	}, []);

	return (
		<SafeAreaView className="flex-1 gap-5 px-4">
			<View className="flex flex-row items-center justify-between px-2 text-foreground">
				<Text className="text-foreground"> Welcome</Text>
				<Pressable onPress={() => router.navigate('/(profile)')} className="px-5">
					<TabBarIcon name="person" className="text-foreground" />
				</Pressable>
			</View>
			<AccountBalance />
			<LatestTransactions count={5} />
		</SafeAreaView>
	);
}
