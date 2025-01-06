import React from 'react';
import { router } from 'expo-router';
import { Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '~/components/ui/button';

export default function addressUpload() {
	return (
		<SafeAreaView className="m-10 flex-1">
			<View className="flex flex-1 items-center justify-between">
				<Image
					source={{ uri: 'https://notioly.com/wp-content/uploads/2022/01/17.Location-1.png' }}
					style={{ width: 300, height: 300, resizeMode: 'contain', backgroundColor: 'transparent' }}
				/>
				<View>
					<Text>TODO: Address Proof Upload logic</Text>
					<Button onPress={() => router.dismiss(2)}>
						<Text className="text-primary-foreground">Upload Address Proof</Text>
					</Button>
				</View>
			</View>
		</SafeAreaView>
	);
}
