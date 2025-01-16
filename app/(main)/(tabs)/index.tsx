import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { use$ } from '@legendapp/state/react';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RequestButton } from '~/components/action-buttons/request-button';
import { HomePageAdsSlider } from '~/components/ads/homepage-ads-slider';
import { PoundIcon } from '~/components/icons/pound-icon';
import { LatestTransactions } from '~/components/transactions/latest-transactions';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Card, CardFooter, CardHeader } from '~/components/ui/card';
import { IconWrapper } from '~/components/ui/icon-wrapper';
import { H1 } from '~/components/ui/typography';
import { formatCurrency } from '~/lib/formatCurrency';
import { registerForPushNotificationsAsync } from '~/lib/usePushNotifications';
import { account$, refreshAccount } from '~/stores/account.store';
import { auth$ } from '~/stores/auth.store';
import { setPushNotificationToken } from '~/stores/push-notification.store';
import { user$ } from '~/stores/user.store';

export default function StartScreen() {
	const balance$ = use$(account$.balance);
	// const isAccountRefreshing$ = use$(account$.isRefreshing);
	const userId$ = use$(auth$.session.user.id);
	const avatarUrl$ = use$(user$.user.avatar_url);
	const [refreshing, setRefreshing] = useState(false);

	const onRefresh = async () => {
		setRefreshing(true);
		try {
			// Refresh the current route
			console.log('Refreshing the route...'); // TODO: Logic to refresh data
		} catch (error) {
			console.error('Failed to refresh the route:', error);
		} finally {
			setRefreshing(false);
		}
	};

	useEffect(() => {
		const registerForPushNotifications = async () => {
			const token = await registerForPushNotificationsAsync();
			if (token) {
				setPushNotificationToken(token);
			}
		};

		const initializeAccount = async () => {
			await refreshAccount();
		};

		if (userId$) {
			registerForPushNotifications();
			initializeAccount();
		}
	}, [userId$]);

	//TODO: color the balance for a second
	// account$.balance.onChange(({ value: newBalance, getPrevious }) => {
	// 	const oldBalance = getPrevious();
	// });

	return (
		<SafeAreaView>
			<ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
				<View className="flex flex-col gap-2 px-4">
					<View className="mt-4 flex flex-row items-center justify-between px-2 text-foreground">
						<View className="w-28">
							<Pressable onPress={() => router.push('/(main)/search')}>
								<PoundIcon />
							</Pressable>
						</View>
						<View className="flex flex-row gap-3">
							<Pressable
								onPress={() => router.push('/(main)/search')}
								className="flex items-center justify-center rounded-2xl bg-muted p-2"
							>
								<Ionicons name="search" size={20} className="text-foreground" />
							</Pressable>
							<Pressable onPress={() => router.push('/(main)/(profile)/profile')}>
								<Avatar alt="User avatar">
									<AvatarImage source={{ uri: avatarUrl$ || undefined }} />
									<AvatarFallback>
										<Ionicons name="person" size={24} className="text-foreground" />
									</AvatarFallback>
								</Avatar>
							</Pressable>
						</View>
						<Pressable onPress={() => router.push('/(main)/(profile)/profile')}>
							<Avatar alt="User avatar">
								<AvatarImage source={{ uri: avatarUrl$ || undefined }} />
								<AvatarFallback>
									<Ionicons name="person" size={24} className="text-foreground" />
								</AvatarFallback>
							</Avatar>
						</Pressable>
					</View>
					<Card>
						<CardHeader className="items-center">
							<Text className="mb-2 text-accent-foreground">Available Balance</Text>
							{/* TODO: use isAccountRefreshing$ to indicate that balance is refreshing, but keep the old balance */}
							{balance$ ? <H1>{formatCurrency(balance$)}</H1> : <ActivityIndicator />}
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
					<HomePageAdsSlider />
					<LatestTransactions count={4} />
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
