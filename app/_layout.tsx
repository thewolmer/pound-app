import '~/global.css';

import { Stack } from 'expo-router';
import { SignOutTemp } from '~/components/SignOutTemp';
import { ThemeToggle } from '~/components/ThemeToggle';
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
					headerShown: true,
					headerLeft: () => <SignOutTemp />,
					headerRight: () => <ThemeToggle />,
				}}
				initialRouteName="(auth)"
			>
				<Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
				<Stack.Screen name="index" options={{ animation: 'fade' }} />
			</Stack>
		</ProvidersWrapper>
	);
}
