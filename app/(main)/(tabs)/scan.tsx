import { router } from 'expo-router';
import { useState } from 'react';
import { Modal, View } from 'react-native';

import { QRScanner } from '~/components/qr-scanner';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

import { useAccount } from '~/context/AccountContext';

import { supabase } from '~/lib/supabase';
import { useHaptics } from '~/lib/useHaptics';

export default function Scan() {
	const { accountId } = useAccount();
	const { triggerHaptics } = useHaptics();
	const [isScannerOpen, setIsScannerOpen] = useState(true);
	const [pendingPayment, setPendingPayment] = useState<PaymentRequest | null>(null);
	const [isSuccessful, setIsSuccessful] = useState<boolean>(false);

	interface PaymentRequest {
		type: 'payment_request';
		accountId: string;
		amount: number;
		reference: string;
	}

	function handleScan(data: string) {
		setIsScannerOpen(false);
		try {
			const paymentData = JSON.parse(data) as PaymentRequest;
			if (paymentData.type === 'payment_request') {
				setPendingPayment(paymentData);
			}
		} catch (error) {
			// Handle invalid QR code data
			console.error('Invalid QR code data:', error);
			setIsScannerOpen(true);
		}
	}

	async function handleApprovePayment() {
		if (!pendingPayment || !accountId) return;

		const { data, error } = await supabase.rpc('make_transfer', {
			amount: pendingPayment.amount,
			origin_account_id: accountId,
			destination_account_id: pendingPayment.accountId,
			reference: pendingPayment.reference,
			// TODO: Add a reasonable message to the payment
			message: 'Payment request',
		});
		if (error) console.error(error);
		triggerHaptics('notification-success');
		setPendingPayment(null);
		setIsSuccessful(true);
	}

	function handleDeclinePayment() {
		// Handle the payment decline logic here
		console.log('Payment declined:', pendingPayment);
		triggerHaptics('notification-warning');
		setPendingPayment(null);
		setIsScannerOpen(true);
		router.replace('/(main)/(tabs)');
	}

	function handleCloseModal() {
		setIsSuccessful(false);
		router.replace('/(main)/(tabs)');
		setIsScannerOpen(true);
	}

	return (
		<View className="h-screen w-full flex-1">
			{isScannerOpen && <QRScanner onScan={handleScan} onCancel={() => router.replace('/(main)/(tabs)')} />}
			<Modal visible={!!pendingPayment} animationType="fade" transparent onRequestClose={() => setPendingPayment(null)}>
				<View className="flex-1 items-center justify-center bg-black/50">
					<View className="w-[80%] max-w-sm rounded-xl bg-background p-6">
						<Text className="mb-2 text-center text-xl">Pay</Text>
						<Text className="mb-6 text-center font-bold text-3xl">£{pendingPayment?.amount}</Text>

						<View className="flex-row gap-4">
							<Button variant="outline" className="flex-1" onPress={handleDeclinePayment}>
								<Text>Decline</Text>
							</Button>
							<Button className="flex-1" onPress={handleApprovePayment}>
								<Text>Approve</Text>
							</Button>
						</View>
					</View>
				</View>
			</Modal>
			<Modal visible={isSuccessful} animationType="fade" transparent onRequestClose={() => handleCloseModal()}>
				<View className="flex-1 items-center justify-center bg-black/50">
					<View className="w-[80%] max-w-sm rounded-xl bg-background p-6">
						<Text className="mb-2 text-center text-xl">Payment successful</Text>
						<Text className="mb-2 text-center text-lg">Add a tick mark here</Text>

						<View className="flex-row gap-4">
							<Button className="flex-1" onPress={handleCloseModal}>
								<Text>Ok</Text>
							</Button>
						</View>
					</View>
				</View>
			</Modal>
		</View>
	);
}
