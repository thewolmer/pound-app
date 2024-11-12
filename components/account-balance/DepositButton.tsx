import { Ionicons } from '@expo/vector-icons';
import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, { useCallback, useRef, useState } from 'react';
import { Text } from 'react-native';
import Animated, { SlideOutLeft } from 'react-native-reanimated';

import { useAccount } from '~/context/AccountContext';
import { supabase } from '~/lib/supabase';
import { useHaptics } from '~/lib/useHaptics';
import { uuid } from '~/lib/utils';
import { NumberPad } from '../number-pad';
import { Button } from '../ui/button';

export const DepositButton = () => {
	const { accountId } = useAccount();
	const depositModal = useRef<BottomSheetModal>(null);
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
		depositModal.current?.close();
	};

	function handleDeposit() {
		setReference(uuid());
		setRequestAmount(null);
		depositModal.current?.present();
	}

	async function handleNumberPadSubmit(amount: number) {
		if (!accountId) return;
		setRequestAmount(amount);
		const { data, error } = await supabase.rpc('make_deposit', {
			amount,
			destination_account_id: accountId,
			reference: 'test',
		});
		if (error) console.error(error);
		triggerHaptics('notification-success');
		depositModal.current?.close();
	}

	return (
		<>
			<Button onPress={handleDeposit} variant={'outline'} haptics="impact-light" size={'lg'}>
				<Ionicons name="business-outline" className="text-foreground" size={22} />
				<Text className="text-foreground text-xs">Deposit</Text>
			</Button>
			<BottomSheetModal
				backdropComponent={renderBackDrop}
				ref={depositModal}
				style={{ backgroundColor: 'transparent' }}
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
					<Animated.View exiting={SlideOutLeft}>
						<NumberPad title={'Deposit Amount'} onClose={handleClose} onSubmit={handleNumberPadSubmit} />
					</Animated.View>
				</BottomSheetView>
			</BottomSheetModal>
		</>
	);
};
