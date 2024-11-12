import { useLocalSearchParams } from 'expo-router';
import type React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { Text } from 'react-native';
import type { Tables } from '~/types/database.types';

export default function TransferScreen() {
	const { account_details } = useLocalSearchParams<{ account_details?: string }>();
	if (!account_details) return null;
	const parsedAccountDetails = account_details ? (JSON.parse(account_details) as Tables<'account_details'>) : undefined;

	return (
		<ScrollView contentInsetAdjustmentBehavior="automatic" className="flex h-full w-full px-5">
			<SafeAreaView>
				<Text className="text-foreground">You are paying to: {parsedAccountDetails?.email}</Text>
			</SafeAreaView>
		</ScrollView>
	);
}
