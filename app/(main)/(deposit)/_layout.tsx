import { router, Stack } from 'expo-router';

import { TabBarIcon } from '~/components/icons/TabBarIcon';
import { Button } from '~/components/ui/button';

export default function DepositLayout() {
	return (
		<Stack initialRouteName="deposit">
			<Stack.Screen
				name="deposit"
				options={{
					title: 'deposit',
					// headerLargeTitle: true,
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
		</Stack>
	);
}
