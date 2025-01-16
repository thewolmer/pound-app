import { router, Stack } from 'expo-router';

import { TabBarIcon } from '~/components/icons/tab-bar-icon';
import { Button } from '~/components/ui/button';
export default function SendLayout() {
	return (
		<Stack initialRouteName="send">
			<Stack.Screen
				name="send"
				options={{
					title: 'Send',
					headerLargeTitle: true,
				}}
			/>
			<Stack.Screen
				name="amount"
				options={{
					title: 'Enter Amount',
					// headerLargeTitle: true,
					headerShadowVisible: false,
				}}
			/>
			<Stack.Screen
				name="confirm"
				options={{
					title: 'Confirm Payment',
					// headerLargeTitle: true,
					headerShadowVisible: false,
					headerLeft(props) {
						return (
							<Button
								haptics="impact-light"
								variant={'link'}
								hitSlop={20}
								onPressIn={() => (router.canDismiss() ? router.dismissAll() : router.replace('/(main)/(tabs)/'))}
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
