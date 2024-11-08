import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const User = () => {
	return (
		<SafeAreaView className="w-full flex-1 ">
			<ScrollView contentInsetAdjustmentBehavior="automatic" className="flex w-full flex-1 p-6 text-foreground">
				<Text className="text-foreground">Todo: ability to update name, phone, email, profile picture, etc</Text>
			</ScrollView>
		</SafeAreaView>
	);
};

export default User;
