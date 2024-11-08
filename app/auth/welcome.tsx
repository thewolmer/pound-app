import { Ionicons } from '@expo/vector-icons';
import { BottomSheetBackdrop, type BottomSheetBackdropProps, BottomSheetView } from '@gorhom/bottom-sheet';
import BottomSheet from '@gorhom/bottom-sheet';
import { Link } from 'expo-router';
import { useCallback, useRef } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

export default function Welcome() {
	const bottomSheetModalRef = useRef<BottomSheet>(null);

	const handlePresentModalPress = useCallback(() => {
		bottomSheetModalRef.current?.snapToIndex(0);
	}, []);

	const renderBackDrop = useCallback(
		(backdropProps: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...backdropProps} />
		),
		[],
	);
	return (
		<SafeAreaView className="flex-1 bg-background">
			<View className="flex-1 items-center justify-between p-6">
				<View className="flex-1 justify-center">
					<Text className="mb-2 font-bold text-4xl text-foreground">Welcome</Text>
					<Text className="mb-12 text-base text-muted-foreground">Get started with your account</Text>
				</View>

				<Button size={'lg'} onPress={handlePresentModalPress} className="w-full">
					<Text>Get Started</Text>
				</Button>

				<BottomSheet
					backdropComponent={renderBackDrop}
					snapPoints={['50%']}
					index={-1}
					enablePanDownToClose
					ref={bottomSheetModalRef}
				>
					<BottomSheetView className="flex-1 gap-4 p-5">
						<Button variant="outline" size={'lg'} className="flex w-full flex-row gap-4">
							<Ionicons name="logo-google" size={24} className="text-foreground" />
							<Text className="font-bold">Continue with Google</Text>
						</Button>

						<Button variant="outline" size={'lg'} className="flex w-full flex-row gap-4">
							<Ionicons name="logo-apple" size={28} className="text-foreground" />
							<Text className="font-bold">Continue with Apple</Text>
						</Button>

						<View className="my-2 w-full border border-border/50" />

						<Link href="/auth/login" asChild>
							<Button variant="secondary" size={'lg'} className="w-full">
								<Text className="font-bold">Login with email</Text>
							</Button>
						</Link>

						<Link href="/auth/register" asChild>
							<Button variant="default" size={'lg'} className="w-full">
								<Text className="font-bold">Sign Up with email</Text>
							</Button>
						</Link>
					</BottomSheetView>
				</BottomSheet>
			</View>
		</SafeAreaView>
	);
}
