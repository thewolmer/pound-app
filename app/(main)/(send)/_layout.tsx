import { Redirect, Stack, Tabs, router } from 'expo-router';
import { View } from 'react-native';

import { TabBarIcon } from '~/components/icons/TabBarIcon';
import { Button } from '~/components/ui/button';
import { useSession } from '~/context/SessionContext';

export default function TabLayout() {
	const { session } = useSession();

	if (!session) {
		return <Redirect href="/auth" />;
	}

	return (
		<Stack initialRouteName="send">
			<Stack.Screen
				name="send"
				options={{
					headerShown: false,
				}}
			/>
		</Stack>
	);
}
