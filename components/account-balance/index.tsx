import { useState } from 'react';
import { Modal, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { NumberPad } from '~/components/number-pad';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { H1 } from '~/components/ui/typography';
import { useAccount } from '~/context/AccountContext';
import { formatCurrency } from '~/lib/formatCurrency';
import { supabase } from '~/lib/supabase';
import { useHaptics } from '~/lib/useHaptics';

type ActionType = 'deposit' | 'request' | null;

export function AccountBalance() {
	const { balance, accountId } = useAccount();
	const { triggerHaptics } = useHaptics();

	const [activeAction, setActiveAction] = useState<ActionType>(null);
	const [requestAmount, setRequestAmount] = useState<string | null>(null);

	const [reference, setReference] = useState<string | null>(null);

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

	async function handleNumberPadSubmit(amount: string) {
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

					<Button onPress={handleRequest}>
						<Text>Request</Text>
					</Button>
				</View>
			</View>

			<Modal visible={!!activeAction} animationType="slide" transparent onRequestClose={closeNumberPadModal}>
				<View className="flex-1 justify-end bg-black/50">
					<NumberPad
						title={activeAction === 'deposit' ? 'Deposit Amount' : 'Request Amount'}
						onClose={closeNumberPadModal}
						onSubmit={handleNumberPadSubmit}
					/>
				</View>
			</Modal>

			<Modal visible={!!requestAmount} animationType="fade" transparent onRequestClose={() => setRequestAmount(null)}>
				<View className="flex-1 items-center justify-center bg-black/50">
					<View className="items-center rounded-xl bg-accent p-6">
						<Text className="mb-4 text-accent-foreground text-xl">Payment Request</Text>
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
						<Button className="mt-6" onPress={() => setRequestAmount(null)}>
							<Text>Close</Text>
						</Button>
					</View>
				</View>
			</Modal>
		</>
	);
}
