import { use$ } from '@legendapp/state/react';
import { Redirect, Stack } from 'expo-router';

import { auth$ } from '~/stores/auth.store';

export default function AuthLayout() {
	const session$ = use$(auth$.session);

	if (session$) {
		return <Redirect href="/" />;
	}

	return (
		<Stack screenOptions={{ headerShown: false }} initialRouteName="welcome">
			<Stack.Screen name="welcome" />
			<Stack.Screen name="login" options={{ presentation: 'modal' }} />
			<Stack.Screen name="register" options={{ presentation: 'modal' }} />
		</Stack>
	);
}
