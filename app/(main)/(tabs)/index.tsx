import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RequestButton } from '~/components/action-buttons/request-button';
import { PoundIcon } from '~/components/icons/pound-icon';
import { LatestTransactions } from '~/components/transactions/latest-transactions';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Card, CardFooter, CardHeader } from '~/components/ui/card';
import { IconWrapper } from '~/components/ui/icon-wrapper';
import { H1 } from '~/components/ui/typography';
import { useAccount } from '~/context/AccountContext';
import { useSession } from '~/context/SessionContext';
import { formatCurrency } from '~/lib/formatCurrency';
import { supabase } from '~/lib/supabase';
import { registerForPushNotificationsAsync } from '~/lib/usePushNotifications';

export default function StartScreen() {
	const { session, person } = useSession();

	const { balance, isLoading } = useAccount();
	const [previousBalance, setPreviousBalance] = useState<number | null>(null);
	const [isChanged, setIsChanged] = useState(false);

	useEffect(() => {
		const registerForPushNotifications = async () => {
			const token = await registerForPushNotificationsAsync();
			if (token) {
				const tokenFromLocalStorage = await AsyncStorage.getItem('pushToken');
				if (tokenFromLocalStorage !== token) {
					const { data } = await supabase
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
	}, [session?.user.id]);

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
					<View className="w-28">
						<PoundIcon />
					</View>
					<Pressable onPress={() => router.push('/(main)/(profile)/profile')}>
						<Avatar alt="User avatar">
							<AvatarImage source={{ uri: person?.avatar_url || undefined }} />
							<AvatarFallback>
								<Ionicons name="person" size={24} className="text-foreground" />
							</AvatarFallback>
						</Avatar>
					</Pressable>
				</View>
				<Card>
					<CardHeader className="items-center">
						<Text className="mb-2 text-accent-foreground">Available Balance</Text>
						{isLoading ? <ActivityIndicator /> : <H1 className={getBalanceColor()}>{formatCurrency(balance)}</H1>}
					</CardHeader>

					<CardFooter className="flex justify-between">
						<Button
							onPress={() => router.push('/(main)/(deposit)/deposit')}
							variant={'link'}
							haptics="impact-light"
							size={'lg'}
						>
							<IconWrapper>
								<Ionicons name="add" className="text-foreground" size={22} />
							</IconWrapper>
							<Text className="text-xs font-semibold text-muted-foreground">Add</Text>
						</Button>
						<Button
							onPress={() => router.push('/(main)/(send)/send')}
							haptics="impact-light"
							variant={'link'}
							size={'lg'}
						>
							<IconWrapper>
								<Ionicons name="arrow-up-circle-outline" className="text-foreground" size={24} />
							</IconWrapper>
							<Text className="text-xs font-semibold text-muted-foreground">Send</Text>
						</Button>
						<RequestButton />
					</CardFooter>
				</Card>
				<LatestTransactions count={5} />
			</View>
		</SafeAreaView>
	);
}
