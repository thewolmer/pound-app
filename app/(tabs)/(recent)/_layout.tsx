import { Stack, router } from 'expo-router';
import { Pressable } from 'react-native';
import { TabBarIcon } from '~/components/icons/TabBarIcon';

export default function ProfileLayout() {
	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{
					title: 'Recent',
					headerLargeTitle: true,
					headerSearchBarOptions: {
						placeholder: 'Search Recent transactions',
					},
				}}
			/>
		</Stack>
	);
}
