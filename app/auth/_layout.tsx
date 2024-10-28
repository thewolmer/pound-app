import { Redirect, Stack } from 'expo-router';
import { useSession } from '~/context/SessionContext';

export default function AuthLayout() {
	const { session } = useSession();

	if (session) {
		return <Redirect href="/" />;
	}

	return (
		<Stack screenOptions={{ headerShown: false }} initialRouteName="welcome">
			<Stack.Screen name="welcome" />
			<Stack.Screen name="login" />
			<Stack.Screen name="register" />
		</Stack>
	);
}
