import { Stack } from 'expo-router';

import { AuthGuard } from '~/components/auth-guard';

export default function MainLayout() {
	return (
		<AuthGuard>
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
				<Stack.Screen
					name="(deposit)"
					options={{
						headerShown: false,
					}}
				/>
			</Stack>
		</AuthGuard>
	);
}
