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
	const [id, setId] = useState<string>('');

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
		const { data: person, error } = await supabase.from('person').select('id').eq('identity_tag', poundTag).single();
		if (!person) {
			alert(`${poundTag} is not a valid PoundTag`);
		} else if (error) {
			alert('Something went wrong');
		} else if (person.id === session?.user.id) {
			alert('You cannot send money to yourself');
		} else {
			setId(person.id);
			setStep(2);
		}
	};

	const handleSendSubmit = async (amount: number) => {
		if (!accountId) return;
		const { data: account, error: accountError } = await supabase
			.from('account')
			.select('id')
			.eq('person_id', id)
			.single();
		if (accountError) console.error(accountError);
		if (!account) return;

		const { data, error: transactionError } = await supabase.rpc('make_transfer', {
			amount,
			origin_account_id: accountId,
			destination_account_id: account.id,
			reference: uuid(), //TODO: add reference field in the modal
		});
		if (transactionError) console.error(transactionError);
		handleClose();
	};

	return (
		<>
			<Button onPress={handleSend} haptics="impact-light" variant={'outline'} size={'lg'}>
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
