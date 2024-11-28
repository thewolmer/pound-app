import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Camera, CameraView } from 'expo-camera';
import * as Linking from 'expo-linking';
import { Alert, Image, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { Button } from '../ui/button';
interface QRScannerProps {
	onScan: (data: string) => void;
	onCancel: () => void;
}

export function QRScanner({ onScan, onCancel }: QRScannerProps) {
	const [hasPermission, setHasPermission] = useState<boolean | null>(null);
	const [flashEnabled, setFlashEnabled] = useState(false);

	const scale = useSharedValue(0.9);

	const animatedBorderStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
	}));

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		requestCameraPermission();
		scale.value = withRepeat(withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.quad) }), -1, true);
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

	// Toggle flashlight state
	function toggleFlashlight() {
		setFlashEnabled((prev) => !prev);
	}

	if (!hasPermission) {
		return null;
	}

	return (
		<View className="flex-1 items-center justify-center">
			<CameraView
				onBarcodeScanned={handleBarCodeScanned}
				barcodeScannerSettings={{
					barcodeTypes: ['qr'],
				}}
				className="absolute inset-0"
				style={StyleSheet.absoluteFillObject}
				enableTorch={flashEnabled}
			/>

			<View className="mb-32 flex items-center justify-center">
				<Animated.View style={[animatedBorderStyle, { height: 288, width: 288 }]} className="relative bg-transparent">
					<View className="absolute left-0 top-0 h-10 w-10 rounded-tl-lg border-l-4 border-t-4 border-primary" />
					<View className="absolute right-0 top-0 h-10 w-10 rounded-tr-lg border-r-4 border-t-4 border-primary" />
					<View className="absolute bottom-0 left-0 h-10 w-10 rounded-bl-lg border-b-4 border-l-4 border-primary" />
					<View className="absolute bottom-0 right-0 h-10 w-10 rounded-br-lg border-b-4 border-r-4 border-primary" />
				</Animated.View>
			</View>

			<Image
				source={require('~/assets/images/pound-logo.png')}
				style={{
					height: 22,
					width: 100,
					opacity: 0.6,
					resizeMode: 'contain',
					marginTop: 10,
				}}
			/>

			<Button haptics="impact-light" variant={'link'} onPress={toggleFlashlight} className="absolute right-2 top-[5%]">
				{flashEnabled ? (
					<Ionicons name="flash-off-outline" size={24} className="text-white" />
				) : (
					<Ionicons name="flash-outline" className="text-white" size={24} />
				)}
			</Button>
		</View>
	);
}
