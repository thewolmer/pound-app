import { Redirect, Stack, router } from 'expo-router';
import { TabBarIcon } from '~/components/icons/TabBarIcon';
import { Button } from '~/components/ui/button';
import { useSession } from '~/context/SessionContext';

export default function SendLayout() {
	const { session } = useSession();

	if (!session) {
		return <Redirect href="/auth" />;
	}

	return (
		<Stack initialRouteName="send">
			<Stack.Screen
				name="send"
				options={{
					title: 'Send',
					// headerLargeTitle: true,
					headerShadowVisible: false,
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
			<Stack.Screen
				name="transfer"
				options={{
					title: 'Transfer',
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
				}}
			/>
		</Stack>
	);
}
