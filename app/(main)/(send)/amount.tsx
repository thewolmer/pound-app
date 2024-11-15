import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import type React from 'react';
import { Image, SafeAreaView, ScrollView, View } from 'react-native';
import { Text } from 'react-native';
import { NumberPad } from '~/components/number-pad';

import type { Tables } from '~/types/database.types';

export default function AmountScreen() {
	const { account_details } = useLocalSearchParams<{ account_details?: string }>();
	if (!account_details) return null;
	const user = account_details ? (JSON.parse(account_details) as Tables<'account_details'>) : undefined;
	const logoFromFile = require('~/assets/images/pound-icon.png');

	const handleSendSubmit = async (amount: number) => {
		router.push({
			pathname: '/(main)/(send)/confirm',
			params: { account_details: JSON.stringify(user), amount: amount },
		});
	};

	return (
		<ScrollView contentInsetAdjustmentBehavior="automatic" className="flex h-full w-full px-5">
			<SafeAreaView>
				<View className="relative h-screen w-full flex-1 flex-col items-center justify-center gap-4">
					<View>
						{user?.avatar_url ? (
							<View>
								<Image source={{ uri: user.avatar_url }} className="h-28 w-28 rounded-full shadow" />
								<View className="absolute right-0 bottom-0 rounded-full bg-white p-2 shadow">
									<Image source={logoFromFile} style={{ width: 15, height: 15 }} />
								</View>
							</View>
						) : (
							<View className="flex h-28 w-28 items-center justify-center rounded-full bg-accent">
								<Text className="text-center text-2xl text-foreground">{user?.display_name?.[0]}</Text>
							</View>
						)}
					</View>
					<View className="flex flex-row items-center gap-2 rounded-xl bg-info px-2 py-1.5">
						<Ionicons name="information-circle" size={24} className="text-info-foreground" />
						<Text className="font-semibold text-info-foreground">You are sending to {user?.display_name}</Text>
					</View>

					<View className="mb-16">
						<NumberPad title="" onClose={() => router.back()} onSubmit={handleSendSubmit} />
					</View>
				</View>
			</SafeAreaView>
		</ScrollView>
	);
}
