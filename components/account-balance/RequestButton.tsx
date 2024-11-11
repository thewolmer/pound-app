import { Ionicons } from '@expo/vector-icons';
import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, { useCallback, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Animated, { SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import { useAccount } from '~/context/AccountContext';
import { supabase } from '~/lib/supabase';
import { useHaptics } from '~/lib/useHaptics';
import { uuid } from '~/lib/utils';
import { NumberPad } from '../number-pad';
import { Button } from '../ui/button';
import { H3 } from '../ui/typography';

export const RequestButton = () => {
	const { accountId } = useAccount();
	const requestModal = useRef<BottomSheetModal>(null);
	const { triggerHaptics } = useHaptics();

	const renderBackDrop = useCallback(
		(backdropProps: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...backdropProps} />
		),
		[],
	);

	const [requestAmount, setRequestAmount] = useState<number | null>(null);

	const [reference, setReference] = useState<string | null>(null);

	const handleClose = () => {
		setReference(null);
		setRequestAmount(null);
		requestModal.current?.close();
	};

	function handleRequest() {
		setReference(uuid());
		setRequestAmount(null);
		requestModal.current?.present();
	}

	async function handleNumberPadSubmit(amount: number) {
		if (!accountId) return;
		setRequestAmount(amount);
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const handleTransactionInsert = (payload: any) => {
		if (payload.new.reference === reference) {
			triggerHaptics('notification-success');
			handleClose();
		}
	};

	supabase
		.channel('account-transaction')
		.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'transaction' }, handleTransactionInsert)
		.subscribe();

	const logoFromFile = require('~/assets/images/icon.png');

	return (
		<>
			<Button onPress={handleRequest} haptics="impact-light" variant={'outline'} size={'lg'}>
				<Ionicons name="arrow-down-circle-outline" className="text-foreground" size={24} />
				<Text className="text-foreground text-xs">Request</Text>
			</Button>
			<BottomSheetModal
				backdropComponent={renderBackDrop}
				ref={requestModal}
				snapPoints={['80']}
				enableDismissOnClose
				enablePanDownToClose={false}
				handleIndicatorStyle={{ backgroundColor: '#fff' }}
				backgroundStyle={{ backgroundColor: 'transparent' }}
				onDismiss={() => {
					handleClose();
				}}
			>
				<BottomSheetView className="flex-1 gap-5 rounded-t-2xl bg-card p-5">
					{!requestAmount ? (
						<Animated.View exiting={SlideOutLeft}>
							<NumberPad title={'Request Amount'} onClose={handleClose} onSubmit={handleNumberPadSubmit} />
						</Animated.View>
					) : (
						<Animated.View entering={SlideInRight}>
							<H3 className="text-center">Payment Request</H3>
							<View className="items-center rounded-xl p-6">
								<Text className="mb-6 font-bold text-2xl text-accent-foreground">£{requestAmount}</Text>
								<QRCode
									value={JSON.stringify({
										type: 'payment_request',
										accountId,
										amount: requestAmount,
										reference: reference,
									})}
									logo={logoFromFile}
									size={300}
								/>
								<Button
									className="mt-6"
									onPress={() => {
										requestModal.current?.close();
										setRequestAmount(null);
									}}
								>
									<Text>Close</Text>
								</Button>
							</View>
						</Animated.View>
					)}
				</BottomSheetView>
			</BottomSheetModal>
		</>
	);
};
