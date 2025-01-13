import '~/global.css';

import { useEffect } from 'react';
import { Stack } from 'expo-router';

import { ProvidersWrapper } from '~/context/Providers';
import { initializeAuth } from '~/lib/auth';
export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
	useEffect(() => {
		let cleanUp: (() => void) | undefined;

		initializeAuth().then((cleanupFn) => {
			cleanUp = cleanupFn;
		});

		return () => {
			if (cleanUp) {
				cleanUp();
			}
		};
	}, []);

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
