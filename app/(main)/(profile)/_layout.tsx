import { router, Stack } from 'expo-router';
import { Pressable } from 'react-native';

import { TabBarIcon } from '~/components/icons/TabBarIcon';

export default function ProfileLayout() {
	return (
		<Stack initialRouteName="profile">
			<Stack.Screen
				name="profile"
				options={{
					title: 'Profile',
					headerLargeTitle: true,
					headerRight: ({ tintColor }) => (
						<Pressable
							hitSlop={20}
							onPressIn={() => {
								router.push('/(profile)/settings');
							}}
						>
							<TabBarIcon name="settings-outline" color={tintColor} />
						</Pressable>
					),
				}}
			/>
			<Stack.Screen
				name="settings"
				options={{
					title: 'Settings',
					headerLargeTitle: true,
				}}
			/>
			<Stack.Screen
				name="user"
				options={{
					title: 'User',
					headerLargeTitle: true,
				}}
			/>
			<Stack.Screen
				name="poundTag"
				options={{
					title: 'Pound Tag',
					headerLargeTitle: true,
				}}
			/>
			<Stack.Screen
				name="(kyc)"
				options={{
					title: 'KYC',
					headerShown: false,
				}}
			/>
		</Stack>
	);
}
