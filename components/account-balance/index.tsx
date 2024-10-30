import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { QRScanner } from '~/components/qr-scanner';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { H1 } from '~/components/ui/typography';

interface NumberPadProps {
	onClose: () => void;
	onSubmit: (amount: string) => void;
}

function NumberPad({ onClose, onSubmit }: NumberPadProps) {
	const [amount, setAmount] = useState('');

	const addDigit = (digit: string) => {
		if (amount.includes('.') && digit === '.') return;
		if (amount.includes('.')) {
			const [, decimal] = amount.split('.');
			if (decimal?.length >= 2) return;
		}
		setAmount((prev) => prev + digit);
	};

	return (
		<View className="rounded-t-3xl bg-background p-4">
			<View className="mb-4 items-center">
				<Text className="text-2xl">Enter Amount</Text>
				<Text className="mt-2 font-bold text-3xl">£{amount || '0'}</Text>
			</View>

			<View className="flex-row flex-wrap justify-between gap-y-4">
				{['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'].map((key) => (
					<Button
						key={key}
						variant="ghost"
						className="w-[30%]"
						onPress={() => {
							if (key === '⌫') setAmount((prev) => prev.slice(0, -1));
							else addDigit(key);
						}}
					>
						<Text className="text-2xl">{key}</Text>
					</Button>
				))}
			</View>

			<View className="mt-4 flex-row gap-4">
				<Button variant="outline" className="flex-1" onPress={onClose}>
					<Text>Cancel</Text>
				</Button>
				<Button className="flex-1" onPress={() => onSubmit(amount)}>
					<Text>OK</Text>
				</Button>
			</View>
		</View>
	);
}

interface PaymentRequest {
	type: 'payment_request';
	amount: string;
}

export function AccountBalance() {
	const [isScanning, setIsScanning] = useState(false);
	const [showNumberPad, setShowNumberPad] = useState(false);
	const [requestAmount, setRequestAmount] = useState<string | null>(null);
	const [pendingPayment, setPendingPayment] = useState<PaymentRequest | null>(null);

	function handleScan(data: string) {
		setIsScanning(false);
		try {
			const paymentData = JSON.parse(data) as PaymentRequest;
			if (paymentData.type === 'payment_request') {
				setPendingPayment(paymentData);
			}
		} catch (error) {
			// Handle invalid QR code data
			console.error('Invalid QR code data:', error);
		}
	}

	function handleApprovePayment() {
		// Handle the payment approval logic here
		console.log('Payment approved:', pendingPayment);
		setPendingPayment(null);
	}

	function handleDeclinePayment() {
		// Handle the payment decline logic here
		console.log('Payment declined:', pendingPayment);
		setPendingPayment(null);
	}

	if (isScanning) {
		return <QRScanner onScan={handleScan} onCancel={() => setIsScanning(false)} />;
	}

	const logoFromFile = require('~/assets/images/icon.png');

	return (
		<>
			<View className="w-full rounded-xl bg-accent p-6">
				<View className="mb-4 flex-row justify-end">
					<Button onPress={() => setIsScanning(true)} variant="ghost" size="icon">
						<Ionicons name="qr-code-outline" size={24} className="text-accent-foreground" />
					</Button>
				</View>

				<View className="mb-8 items-center">
					<Text className="mb-2 text-accent-foreground">Available Balance</Text>
					<H1>£1,234.56</H1>
				</View>

				<View className="flex-row justify-center gap-4">
					<Button
						onPress={() => {
							/* Handle deposit */
						}}
					>
						<Text>Deposit</Text>
					</Button>

					<Button onPress={() => setShowNumberPad(true)}>
						<Text>Request</Text>
					</Button>
				</View>
			</View>

			<Modal visible={showNumberPad} animationType="slide" transparent onRequestClose={() => setShowNumberPad(false)}>
				<View className="flex-1 justify-end bg-black/50">
					<NumberPad
						onClose={() => setShowNumberPad(false)}
						onSubmit={(amount) => {
							setRequestAmount(amount);
							setShowNumberPad(false);
						}}
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
								amount: requestAmount,
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
		</>
	);
}
