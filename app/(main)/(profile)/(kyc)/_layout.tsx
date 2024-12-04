import React from 'react';
import { Stack } from 'expo-router';
export default function KYCLayout() {
	return (
		<Stack>
			<Stack.Screen
				name="kyc"
				options={{
					title: 'KYC',
					headerShown: true,
				}}
			/>
			<Stack.Screen
				name="first"
				options={{
					headerShown: true,
				}}
			/>
			<Stack.Screen
				name="second"
				options={{
					headerShown: true,
				}}
			/>
			<Stack.Screen
				name="third"
				options={{
					headerShown: true,
				}}
			/>
		</Stack>
	);
}
