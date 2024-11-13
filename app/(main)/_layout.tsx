import { Redirect, Stack } from 'expo-router';

import { useSession } from '~/context/SessionContext';

export default function MainLayout() {
	const { session } = useSession();

	if (!session) {
		return <Redirect href="/auth" />;
	}

	return (
		<Stack initialRouteName="(tabs)">
			<Stack.Screen
				name="(tabs)"
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="(profile)"
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="(send)"
				options={{
					headerShown: false,
				}}
			/>
		</Stack>
	);
}
