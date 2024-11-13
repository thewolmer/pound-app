import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, { useCallback, useRef, useState } from 'react';
import { Platform, Text } from 'react-native';
import Animated, { SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import { useAccount } from '~/context/AccountContext';
import { useSession } from '~/context/SessionContext';
import { supabase } from '~/lib/supabase';
import { uuid } from '~/lib/utils';
import { NumberPad } from '../number-pad';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { H3 } from '../ui/typography';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { Tables } from '~/types/database.types';

export const SendButton = () => {
	const { accountId } = useAccount();
	const { session } = useSession();
	const sendModal = useRef<BottomSheetModal>(null);

	const renderBackDrop = useCallback(
		(backdropProps: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...backdropProps} />
		),
		[],
	);

	const [poundTag, setPoundTag] = useState<string>('');
	const [step, setStep] = useState<number>(1);
	const [accountTo, setAccountTo] = useState<Tables<'account_details'> | null>(null);

	function handleSend() {
		setPoundTag('');
		sendModal.current?.present();
	}

	const handleClose = () => {
		setPoundTag('');
		setStep(1);
		sendModal.current?.close();
	};

	const handleVerifyTag = async () => {
		const { data, error } = await supabase.from('account_details').select().eq('identity_tag', poundTag).single();
		if (!data) {
			alert(`${poundTag} is not a valid PoundTag`);
			return;
		}

		if (error) {
			alert('Something went wrong');
			return;
		}

		if (data.person_id === session?.user.id) {
			alert('You cannot send money to yourself');
			return;
		}

		setAccountTo(data);
		setStep(2);
	};

	const handleSendSubmit = async (amount: number) => {
		if (!accountId || !accountTo?.account_id) return;

		const { error } = await supabase.rpc('make_transfer', {
			amount,
			origin_account_id: accountId,
			destination_account_id: accountTo.account_id,
			reference: uuid(), //TODO: add reference field in the modal
		});
		if (error) console.error(error);
		handleClose();
	};

	return (
		<>
			{/* TODO: move this to the send screen */}
			<Button onPress={() => router.push('/(main)/(send)')} haptics="impact-light" variant={'outline'} size={'lg'}>
				<Ionicons name="arrow-up-circle-outline" className="text-foreground" size={24} />
				<Text className="text-foreground text-xs">Send</Text>
			</Button>
			<BottomSheetModal
				backdropComponent={renderBackDrop}
				ref={sendModal}
				snapPoints={['80']}
				enableDismissOnClose
				handleIndicatorStyle={{ backgroundColor: '#fff' }}
				backgroundStyle={{ backgroundColor: 'transparent' }}
				onDismiss={() => {
					handleClose();
				}}
			>
				<BottomSheetView className="flex-1 gap-5 rounded-t-2xl bg-card p-5">
					<H3>Send Money</H3>
					{step === 1 && (
						<Animated.View exiting={SlideOutLeft}>
							<Input
								placeholder="PoundTag"
								value={poundTag}
								onChangeText={setPoundTag}
								autoCapitalize="none"
								secureTextEntry={Platform.OS !== 'ios'}
								keyboardType={Platform.OS === 'ios' ? undefined : 'visible-password'}
								returnKeyType="next"
								onSubmitEditing={handleVerifyTag}
								autoFocus
							/>
							<Button disabled={poundTag.length < 3} onPress={handleVerifyTag} className="mt-5">
								<Text className="text-white">Next</Text>
							</Button>
						</Animated.View>
					)}
					{step === 2 && (
						<Animated.View entering={SlideInRight}>
							<NumberPad title="Amount to Send" onClose={() => handleClose()} onSubmit={handleSendSubmit} />
						</Animated.View>
					)}
				</BottomSheetView>
			</BottomSheetModal>
		</>
	);
};
