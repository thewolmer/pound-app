import { Camera, CameraView } from 'expo-camera';
import * as Linking from 'expo-linking';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

interface QRScannerProps {
	onScan: (data: string) => void;
	onCancel: () => void;
}

export function QRScanner({ onScan, onCancel }: QRScannerProps) {
	const [hasPermission, setHasPermission] = useState<boolean | null>(null);

	useEffect(() => {
		requestCameraPermission();
	}, []);

	async function requestCameraPermission() {
		const { status } = await Camera.requestCameraPermissionsAsync();

		if (status === 'granted') {
			setHasPermission(true);
			return;
		}

		setHasPermission(false);
		Alert.alert('Camera Permission Required', 'Please enable camera access in your device settings to scan QR codes.', [
			{
				text: 'Cancel',
				style: 'cancel',
				onPress: onCancel,
			},
			{
				text: 'Open Settings',
				onPress: () => {
					Linking.openSettings();
					onCancel();
				},
			},
		]);
	}

	function handleBarCodeScanned({ data }: { data: string }) {
		onScan(data);
	}

	if (!hasPermission) {
		return null;
	}

	return (
		<View className="flex-1">
			<CameraView
				onBarcodeScanned={handleBarCodeScanned}
				barcodeScannerSettings={{
					barcodeTypes: ['qr'],
				}}
				style={StyleSheet.absoluteFillObject}
			/>
			<Button className="absolute right-0 bottom-8 left-0 mx-auto w-32" onPress={onCancel}>
				<Text>Cancel</Text>
			</Button>
		</View>
	);
}
