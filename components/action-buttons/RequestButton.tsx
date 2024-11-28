import React, { useCallback, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetView,
} from '@gorhom/bottom-sheet';
import { Text, View } from 'react-native';
import QRCodeStyled from 'react-native-qrcode-styled';
import Animated, { SlideInDown, SlideOutDown, SlideOutUp } from 'react-native-reanimated';

import { NumberPad } from '../number-pad';
import { Button } from '../ui/button';
import { H3 } from '../ui/typography';
import { NAV_THEME } from '~/constants/theme';
import { useAccount } from '~/context/AccountContext';
import { supabase } from '~/lib/supabase';
import { useHaptics } from '~/lib/useHaptics';
import { cn, uuid } from '~/lib/utils';

export const RequestButton = () => {
	const { accountId } = useAccount();
	const requestModal = useRef<BottomSheetModal>(null);
	const { triggerHaptics } = useHaptics();

	const renderBackDrop = useCallback(
		(backdropProps: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...backdropProps} />
		),
		[]
	);

	const [requestAmount, setRequestAmount] = useState<number | null>(null);

	const [reference, setReference] = useState<string | null>(null);

	const handleClose = () => {
		setReference(null);
		setRequestAmount(null);
		requestModal.current?.close();
	};

	function handleRequest() {
		setRequestAmount(null);
		requestModal.current?.present();
	}

	async function handleNumberPadSubmit(amount: number) {
		if (!accountId) return;
		setReference(uuid());
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

	const logoFromFile = require('~/assets/images/icon-for-qr-code.png');

	return (
		<>
			<Button onPress={handleRequest} haptics="impact-light" variant={'outline'} size={'lg'}>
				<Ionicons name="arrow-down-circle-outline" className="text-foreground" size={24} />
				<Text className="text-xs text-foreground">Request</Text>
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
				<BottomSheetView
					className={cn(
						'flex-1 gap-5 rounded-t-2xl p-5 transition-all duration-700',
						requestAmount ? 'bg-cyan-50' : 'bg-card'
					)}
				>
					{!requestAmount && (
						<Animated.View entering={SlideInDown} exiting={SlideOutDown}>
							<NumberPad title={'Request Amount'} onClose={handleClose} onSubmit={handleNumberPadSubmit} />
						</Animated.View>
					)}

					{requestAmount !== null && requestAmount > 0 && (
						<Animated.View entering={SlideInDown} exiting={SlideOutUp}>
							<H3 className={cn('text-center', requestAmount ? 'text-neutral-800' : '')}>Payment Request</H3>
							<View className="items-center rounded-xl p-6">
								<Text
									className={cn(
										'mb-6 text-2xl font-bold',
										requestAmount ? 'text-neutral-800' : 'text-accent-foreground'
									)}
								>
									£{requestAmount}
								</Text>
								<View className="">
									<QRCodeStyled
										data={JSON.stringify({
											type: 'payment_request',
											accountId,
											amount: requestAmount,
											reference: reference,
										})}
										padding={5}
										pieceSize={6}
										pieceCornerType="rounded"
										isPiecesGlued
										pieceBorderRadius={2}
										outerEyesOptions={{
											borderRadius: 10,
											color: NAV_THEME.dark.primary,
											strokeWidth: 2,
											stroke: NAV_THEME.dark.primary,
										}}
										logo={{
											href: logoFromFile,
											hidePieces: false,
											scale: 1.1,
										}}
									/>
								</View>
								<Button
									className="mt-20 w-full max-w-sm"
									variant={'default'}
									onPress={() => {
										requestModal.current?.close();
										setRequestAmount(null);
									}}
								>
									<Text className="text-white">Close</Text>
								</Button>
							</View>
						</Animated.View>
					)}
				</BottomSheetView>
			</BottomSheetModal>
		</>
	);
};
