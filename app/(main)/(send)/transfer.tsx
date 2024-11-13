import { Ionicons } from '@expo/vector-icons';
import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetView,
} from '@gorhom/bottom-sheet';
import { router, useLocalSearchParams } from 'expo-router';
import type React from 'react';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Image, SafeAreaView, ScrollView, View } from 'react-native';
import { Text } from 'react-native';
import Animated, { BounceIn, FadeInDown, FadeOut } from 'react-native-reanimated';
import { NumberPad } from '~/components/number-pad';
import { Button } from '~/components/ui/button';
import { useAccount } from '~/context/AccountContext';
import { formatCurrency } from '~/lib/formatCurrency';
import { supabase } from '~/lib/supabase';
import { useHaptics } from '~/lib/useHaptics';
import { cn, uuid } from '~/lib/utils';
import type { Tables } from '~/types/database.types';

export default function TransferScreen() {
	const { account_details } = useLocalSearchParams<{ account_details?: string }>();
	if (!account_details) return null;
	const user = account_details ? (JSON.parse(account_details) as Tables<'account_details'>) : undefined;
	const logoFromFile = require('~/assets/images/pound-icon.png');
	const successModal = useRef<BottomSheetModal>(null);
	const [success, setSuccess] = useState<boolean | null>(null);
	const [amount, setAmount] = useState<number | null>(null);
	const { triggerHaptics } = useHaptics();

	const { accountId } = useAccount();

	const handleSendSubmit = async (amount: number) => {
		if (!accountId || !user?.account_id) return;

		const { error } = await supabase.rpc('make_transfer', {
			amount,
			origin_account_id: accountId,
			destination_account_id: user.account_id,
			reference: uuid(),
		});
		if (error) {
			console.error(error);
			triggerHaptics('notification-error');
			return alert('Something went wrong');
		}
		successModal.current?.present();
		setTimeout(() => {
			setAmount(amount);
			setSuccess(true);
			triggerHaptics('notification-success');
		}, 1000);
	};

	const renderBackDrop = useCallback(
		(backdropProps: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...backdropProps} />
		),
		[],
	);

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

			<BottomSheetModal
				backdropComponent={renderBackDrop}
				ref={successModal}
				snapPoints={['80%']}
				enableDismissOnClose
				handleIndicatorStyle={{ backgroundColor: '#fff' }}
				backgroundStyle={{ backgroundColor: 'transparent' }}
				onDismiss={() => {
					router.dismissAll();
				}}
			>
				<BottomSheetView
					className={cn(
						'flex h-full flex-1 flex-col items-center justify-center gap-5 rounded-t-2xl p-5 transition-all duration-700',
						success ? 'bg-success' : 'bg-card',
					)}
				>
					{success === null && <ActivityIndicator size="large" />}
					{success === true && (
						<Animated.View entering={BounceIn} className="items-center justify-center">
							<Ionicons name="checkmark-circle" size={100} className="text-success-foreground" />
						</Animated.View>
					)}
					{success === true && amount && (
						<Animated.View entering={FadeInDown} exiting={FadeOut} className={'flex gap-20'}>
							<Text className="font-semibold text-success-foreground">
								You sent {formatCurrency(amount)} to {user?.display_name}
							</Text>
							<Button
								variant={'secondary'}
								haptics={'impact-light'}
								onPress={() => {
									successModal.current?.dismiss();
									router.dismissAll();
								}}
							>
								<Text className="text-secondary-foreground">Done</Text>
							</Button>
						</Animated.View>
					)}
				</BottomSheetView>
			</BottomSheetModal>
		</ScrollView>
	);
}
