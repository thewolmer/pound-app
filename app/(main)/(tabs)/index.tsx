import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DepositButton } from '~/components/action-buttons/DepositButton';
import { RequestButton } from '~/components/action-buttons/RequestButton';
import { SendButton } from '~/components/action-buttons/SendButton';
import { TabBarIcon } from '~/components/icons/TabBarIcon';
import { LatestTransactions } from '~/components/latest-transactions';
import { Card, CardFooter, CardHeader } from '~/components/ui/card';
import { H1 } from '~/components/ui/typography';
import { useAccount } from '~/context/AccountContext';
import { useSession } from '~/context/SessionContext';
import { formatCurrency } from '~/lib/formatCurrency';
import { supabase } from '~/lib/supabase';
import { registerForPushNotificationsAsync } from '~/lib/usePushNotifications';

export default function StartScreen() {
	const { session } = useSession();
	if (!session) return null;

	const { balance, isLoading } = useAccount();
	const [previousBalance, setPreviousBalance] = useState<number | null>(null);
	const [isChanged, setIsChanged] = useState(false);

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
							person_id: session.user.id,
						})
						.select();
					if (data) {
						await AsyncStorage.setItem('pushToken', token);
					}
				}
			}
		};

		registerForPushNotifications();
	}, [session.user.id]);

	useEffect(() => {
		if (isLoading) return;
		if (previousBalance === null) {
			setPreviousBalance(balance);
			return;
		}

		if (balance !== previousBalance) {
			setIsChanged(true);

			const timer = setTimeout(() => {
				setPreviousBalance(balance);
				setIsChanged(false);
			}, 1000);

			return () => clearTimeout(timer);
		}
	}, [balance, previousBalance, isLoading]);

	const getBalanceColor = () => {
		if (!isChanged || balance === previousBalance) return '';

		return balance > (previousBalance || 0) ? 'text-success-foreground' : 'text-destructive-foreground';
	};

	return (
		<SafeAreaView className="flex-1">
			<View className="flex flex-1 flex-col gap-5 px-4">
				<View className="flex flex-row items-center justify-between px-2 text-foreground">
					<Text className="text-foreground"> Welcome</Text>
					<Pressable onPress={() => router.navigate('/(profile)')} className="px-5">
						<TabBarIcon name="person" className="text-foreground" />
					</Pressable>
				</View>
				<Card>
					<CardHeader className="items-center">
						<Text className="mb-2 text-accent-foreground">Available Balance</Text>
						<H1 className={getBalanceColor()}>{formatCurrency(Number(balance))}</H1>
					</CardHeader>

					<CardFooter className="flex justify-between">
						<DepositButton />
						<SendButton />
						<RequestButton />
					</CardFooter>
				</Card>
				<LatestTransactions count={5} />
			</View>
		</SafeAreaView>
	);
}
