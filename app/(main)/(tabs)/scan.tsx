import { useCallback, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { ActivityIndicator, Modal, View } from 'react-native';

import { QRScanner } from '~/components/qr-scanner';
import { supabase } from '~/lib/supabase';
import { useHaptics } from '~/lib/use-haptics';

export default function Scan() {
	const { triggerHaptics } = useHaptics();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isScanOpen, setScanOpen] = useState<boolean>(true);

	useFocusEffect(
		useCallback(() => {
			return () => setTimeout(() => setScanOpen(true), 1000);
			// 1s timeout is set to prevent multiple scans from happening
		}, [])
	);

	interface PaymentRequest {
		type: 'payment_request';
		accountId: string;
		amount: number;
		reference: string;
	}

	async function handleScan(data: string) {
		try {
			const paymentData = JSON.parse(data) as PaymentRequest;
			if (paymentData.type === 'payment_request') {
				setScanOpen(false);
				setIsLoading(true);
				const { data, error } = await supabase
					.from('account_details')
					.select('*')
					.eq('account_id', paymentData.accountId)
					.single();
				if (error) {
					throw new Error(error.message);
				}
				triggerHaptics('notification-success');
				router.replace({
					pathname: '/(main)/(send)/confirm',
					params: { account_details: JSON.stringify(data), amount: paymentData.amount },
				});
			}
		} catch (error) {
			console.error('Invalid QR code data:', error);
			setScanOpen(true);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<View className="h-screen w-full flex-1">
			{isScanOpen && <QRScanner onScan={handleScan} onCancel={() => router.replace('/(main)/(tabs)')} />}
			<Modal visible={isLoading} animationType="fade" transparent>
				<View className="flex-1 items-center justify-center">
					<ActivityIndicator size="large" />
				</View>
			</Modal>
		</View>
	);
}
