import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { use$ } from '@legendapp/state/react';
import { router, useLocalSearchParams } from 'expo-router';
import { Image, SafeAreaView, Text, View } from 'react-native';
import Animated, { BounceIn, FadeIn, FadeInUp, FadeOut, SlideInDown } from 'react-native-reanimated';

import { Button } from '~/components/ui/button';
import { formatCurrency } from '~/lib/formatCurrency';
import { supabase } from '~/lib/supabase';
import { useHaptics } from '~/lib/use-haptics';
import { uuid } from '~/lib/utils';
import { account$ } from '~/stores/account.store';
import type { Tables } from '~/types/database.types';

export default function TransferScreen() {
	const { account_details, amount, message } = useLocalSearchParams<{
		account_details?: string;
		amount?: string;
		message?: string;
	}>();

	const user = account_details ? (JSON.parse(account_details) as Tables<'account_details'>) : undefined;
	const amountToSend = amount ? Number.parseFloat(amount) : 0;

	const logoFromFile = require('~/assets/images/pound-icon.png');

	const accountId$ = use$(account$.accountId);
	const { triggerHaptics } = useHaptics();
	const [success, setSuccess] = useState<boolean | null>(null);

	if (!account_details || !amount) return null;

	const handleSendSubmit = async () => {
		if (!accountId$ || !user?.account_id || !amount) return;

		const { error } = await supabase.rpc('make_transfer', {
			amount: amountToSend,
			origin_account_id: accountId$,
			destination_account_id: user.account_id,
			reference: uuid(),
			message: message || '',
		});
		if (error) {
			console.error(error);
			triggerHaptics('notification-error');
			return alert('Something went wrong');
		}
		setSuccess(true);
		triggerHaptics('notification-success');
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View className="relative h-full w-full flex-1 flex-col items-center justify-center gap-4">
				{success === null && (
					<Animated.View entering={FadeInUp} exiting={FadeOut} className="flex flex-col items-center gap-2">
						{user?.avatar_url ? (
							<View>
								<Image source={{ uri: user.avatar_url }} className="h-28 w-28 rounded-full shadow" />
								<View className="absolute bottom-0 right-0 rounded-full bg-white p-2 shadow">
									<Image source={logoFromFile} style={{ width: 15, height: 15 }} />
								</View>
							</View>
						) : (
							<View className="flex h-28 w-28 items-center justify-center rounded-full bg-accent">
								<Text className="text-center text-2xl text-foreground">{user?.display_name?.[0]}</Text>
							</View>
						)}
					</Animated.View>
				)}
				{success === true && (
					<Animated.View entering={BounceIn} className="items-center justify-center">
						<Ionicons name="checkmark-circle" size={112} className="text-success-foreground" />
					</Animated.View>
				)}
				<View className="flex flex-row items-center gap-2 rounded-xl px-2 py-1.5">
					{success === null && (
						<Animated.Text entering={FadeIn} exiting={FadeOut} className="font-semibold text-info-foreground">
							Send {formatCurrency(amountToSend)} to {user?.display_name}
						</Animated.Text>
					)}
					{success === true && (
						<Animated.Text entering={SlideInDown} className="font-semibold text-success-foreground">
							Sent {formatCurrency(amountToSend)} to {user?.display_name}
						</Animated.Text>
					)}
				</View>

				{success === null && (
					<Animated.View entering={FadeIn} exiting={FadeOut} className="flex flex-row gap-2">
						<Button
							size={'lg'}
							variant={'secondary'}
							onPressOut={() => (router.canDismiss() ? router.dismissAll() : router.replace('/(main)/(tabs)/'))}
							disabled={success}
						>
							<Text className="text-lg text-secondary-foreground">Cancel</Text>
						</Button>
						<Button size={'lg'} onPressOut={handleSendSubmit} disabled={success}>
							<Text className="text-lg text-primary-foreground">Confirm</Text>
						</Button>
					</Animated.View>
				)}
			</View>
		</SafeAreaView>
	);
}
