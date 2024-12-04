import React from 'react';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '~/components/ui/button';

export default function Third() {
	return (
		<SafeAreaView className="m-10 flex-1">
			<View>
				<Text>TODO: Id Proof Upload logic</Text>
				<Button onPress={() => router.dismiss(2)}>
					<Text className="text-primary-foreground">Upload Id Proof</Text>
				</Button>
			</View>
		</SafeAreaView>
	);
}
