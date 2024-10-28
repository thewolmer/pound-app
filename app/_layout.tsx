import '~/global.css';

import { Stack } from 'expo-router';
import { cssInterop } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProvidersWrapper } from '~/context/Providers';
export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from 'expo-router';

cssInterop(SafeAreaView, { className: 'style' });

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
				<Stack.Screen name="(tabs)" />
			</Stack>
		</ProvidersWrapper>
	);
}
