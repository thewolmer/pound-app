import { router, Stack } from 'expo-router';

import { TabBarIcon } from '~/components/icons/TabBarIcon';
import { Button } from '~/components/ui/button';

export default function RecentLayout() {
	return (
		<Stack initialRouteName="transactions">
			<Stack.Screen
				name="transactions"
				options={{
					title: 'Recent',
					headerShadowVisible: false,
					headerLeft(props) {
						return (
							<Button
								haptics="impact-light"
								variant={'link'}
								hitSlop={20}
								onPressIn={() => router.back()}
								className="flex-row items-center px-5"
							>
								<TabBarIcon name="arrow-back" className="text-foreground" />
							</Button>
						);
					},
				}}
			/>
			<Stack.Screen
				name="[transaction]"
				options={{
					title: 'Transaction',
					headerShadowVisible: false,
				}}
			/>
		</Stack>
	);
}
