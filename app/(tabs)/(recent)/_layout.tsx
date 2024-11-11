import { Stack, router } from 'expo-router';
import { TabBarIcon } from '~/components/icons/TabBarIcon';
import { Button } from '~/components/ui/button';

export default function ProfileLayout() {
	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{
					title: 'Transactions',
					headerLargeTitle: false,
					headerLeft(props) {
						return (
							<Button
								haptics="impact-light"
								variant={'link'}
								onPress={() => router.back()}
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
