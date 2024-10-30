import { Stack, router } from 'expo-router';
import { Pressable } from 'react-native';
import { TabBarIcon } from '~/components/icons/TabBarIcon';

export default function ProfileLayout() {
	return (
		<Stack>
			<Stack.Screen
				name="profile"
				options={{
					title: 'Profile',
					headerLargeTitle: true,
					headerRight: ({ tintColor }) => (
						<Pressable onPress={() => router.push('/(profile)/settings')}>
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
		</Stack>
	);
}
