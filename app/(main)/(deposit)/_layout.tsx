import { router, Stack } from 'expo-router';

import { TabBarIcon } from '~/components/icons/TabBarIcon';
import { Button } from '~/components/ui/button';

export default function DepositLayout() {
	return (
		<Stack initialRouteName="deposit">
			<Stack.Screen
				name="deposit"
				options={{
					title: 'Add Funds',
					headerLargeTitle: true,
					headerShadowVisible: false,
				}}
			/>
			<Stack.Screen
				name="add-card"
				options={{
					title: 'Add New Card',
					headerLargeTitle: true,
					headerShadowVisible: false,
				}}
			/>
			<Stack.Screen
				name="manage-cards"
				options={{
					title: 'Manage Cards',
					headerLargeTitle: true,
					headerShadowVisible: false,
					headerRight(props) {
						return (
							<Button
								haptics="impact-light"
								variant={'link'}
								hitSlop={20}
								onPressIn={() => router.push('/(main)/(deposit)/add-card')}
								className="flex-row items-center"
							>
								<TabBarIcon name="add-circle-outline" className="text-foreground" size={25} />
							</Button>
						);
					},
				}}
			/>
		</Stack>
	);
}
