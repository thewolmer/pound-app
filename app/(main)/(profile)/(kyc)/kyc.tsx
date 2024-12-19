import React from 'react';
import { router } from 'expo-router';
import { Image, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ForwardCard } from '~/components/ui/forward-card';

export default function Kyc() {
	return (
		<SafeAreaView className="flex-1 p-10">
			<View className="flex flex-1 items-center justify-between">
				<Image
					source={{ uri: 'https://notioly.com/wp-content/uploads/2023/09/286.Passports.png' }}
					style={{ width: 300, height: 300, resizeMode: 'contain', backgroundColor: 'transparent' }}
				/>

				<View>
					<ForwardCard
						title="Verify contact info"
						description="Confirm your email address"
						ionicons="mail-open"
						onPress={() => router.push('/(profile)/(kyc)/first')}
					/>
					<ForwardCard
						title="Verify address"
						description="Upload an address proof"
						ionicons="pin-outline"
						onPress={() => router.push('/(profile)/(kyc)/second')}
					/>
					<ForwardCard
						title="Verify identity"
						description="Upload an identity proof"
						ionicons="id-card-outline"
						onPress={() => router.push('/(profile)/(kyc)/third')}
					/>
				</View>
			</View>
		</SafeAreaView>
	);
}
