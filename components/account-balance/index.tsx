import { useCallback, useRef, useState } from 'react';
import { Modal, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetView,
} from '@gorhom/bottom-sheet';
import { NumberPad } from '~/components/number-pad';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { H1, H3 } from '~/components/ui/typography';
import { useAccount } from '~/context/AccountContext';
import { formatCurrency } from '~/lib/formatCurrency';
import { supabase } from '~/lib/supabase';
import { useHaptics } from '~/lib/useHaptics';
import SendButton from './SendButton';

type ActionType = 'deposit' | 'request' | 'send' | null;

export function AccountBalance() {
	const { balance, accountId } = useAccount();
	const { triggerHaptics } = useHaptics();

	const requestModal = useRef<BottomSheetModal>(null);

	const [activeAction, setActiveAction] = useState<ActionType>(null);
	const [requestAmount, setRequestAmount] = useState<number | null>(null);

	const [reference, setReference] = useState<string | null>(null);

	const renderBackDrop = useCallback(
		(backdropProps: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...backdropProps} />
		),
		[],
	);

	// biome-ignore lint/suspicious/noExplicitAny: fix with correct type
	const handleTransactionInsert = (payload: any) => {
		if (payload.new.reference === reference) {
			triggerHaptics('notification-success');
			setRequestAmount(null);
			setReference(null);
		}
	};

	supabase
		.channel('account-transaction')
		.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'transaction' }, handleTransactionInsert)
		.subscribe();

	async function handleNumberPadSubmit(amount: number) {
		if (!accountId) return;
		if (activeAction === 'deposit') {
			const { data, error } = await supabase.rpc('make_deposit', {
				amount,
				destination_account_id: accountId,
				reference: 'test',
			});
			if (error) console.error(error);
			triggerHaptics('notification-success');
			//TODO: add some visual feedback that deposit is completed
			//TODO: add some data on rpc return
		} else if (activeAction === 'request') {
			setRequestAmount(amount);
			requestModal.current?.present();
		}
		setActiveAction(null);
	}

	function handleDeposit() {
		setActiveAction('deposit');
	}

	function uuid() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
			const r = (Math.random() * 16) | 0;
			const v = c === 'x' ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});
	}

	function handleRequest() {
		setReference(uuid());
		setActiveAction('request');
	}

	const closeNumberPadModal = () => {
		setReference(null);
		setActiveAction(null);
	};

	const logoFromFile = require('~/assets/images/icon.png');

	return (
		<>
			<View className="w-full rounded-xl bg-accent p-6">
				<View className="mb-8 items-center">
					<Text className="mb-2 text-accent-foreground">Available Balance</Text>
					<H1>{formatCurrency(Number(balance))}</H1>
				</View>

				<View className="flex-row justify-center gap-4">
					<Button onPress={handleDeposit}>
						<Text>Deposit</Text>
					</Button>

					<SendButton />

					<Button onPress={handleRequest}>
						<Text>Request</Text>
					</Button>
				</View>
			</View>

			<Modal
				visible={!!activeAction && activeAction !== 'send'}
				animationType="slide"
				transparent
				onRequestClose={closeNumberPadModal}
			>
				<View className="flex-1 justify-end bg-black/50">
					<NumberPad
						title={activeAction === 'deposit' ? 'Deposit Amount' : 'Request Amount'}
						onClose={closeNumberPadModal}
						onSubmit={handleNumberPadSubmit}
					/>
				</View>
			</Modal>
			{/* request */}
			<BottomSheetModal
				backdropComponent={renderBackDrop}
				ref={requestModal}
				snapPoints={['90']}
				enableDismissOnClose
				enablePanDownToClose={false}
				onDismiss={() => setRequestAmount(null)}
			>
				<BottomSheetView className="flex-1 gap-5 p-5">
					<H3>Payment Request</H3>
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
				</BottomSheetView>
			</BottomSheetModal>
		</>
	);
}
