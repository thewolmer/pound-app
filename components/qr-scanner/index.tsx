import { Ionicons } from '@expo/vector-icons';
import { Camera, CameraView } from 'expo-camera';
import * as Linking from 'expo-linking';
import { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
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
					<View className="absolute top-0 left-0 h-10 w-10 rounded-tl-lg border-primary border-t-4 border-l-4" />
					<View className="absolute top-0 right-0 h-10 w-10 rounded-tr-lg border-primary border-t-4 border-r-4" />
					<View className="absolute bottom-0 left-0 h-10 w-10 rounded-bl-lg border-primary border-b-4 border-l-4" />
					<View className="absolute right-0 bottom-0 h-10 w-10 rounded-br-lg border-primary border-r-4 border-b-4" />
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

			<Button haptics="impact-light" variant={'link'} onPress={toggleFlashlight} className="absolute top-[5%] right-2">
				{flashEnabled ? (
					<Ionicons name="flash-off-outline" size={24} className="text-white" />
				) : (
					<Ionicons name="flash-outline" className="text-white" size={24} />
				)}
			</Button>
		</View>
	);
}
