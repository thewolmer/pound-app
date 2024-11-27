import '~/global.css';

import { Stack } from 'expo-router';
import { ProvidersWrapper } from '~/context/Providers';
export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
	return (
		<ProvidersWrapper>
			<Stack
				screenOptions={{
					headerShown: false,
				}}
				initialRouteName="auth"
			>
				<Stack.Screen name="auth" />
				<Stack.Screen name="(main)" />
				<Stack.Screen name="offline" />
			</Stack>
		</ProvidersWrapper>
	);
}
