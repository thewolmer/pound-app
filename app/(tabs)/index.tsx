import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AccountBalance } from '~/components/account-balance';
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
		<SafeAreaView className="flex-1 justify-between">
			<AccountBalance />
			<LatestTransactions count={5} />
		</SafeAreaView>
	);
}
