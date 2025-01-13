import { use$ } from '@legendapp/state/react';
import { Redirect, useSegments } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { auth$ } from '~/stores/auth.store';

interface AuthGuardProps {
	children: React.ReactNode;
}

//TODO: probably have to do some extra checks for session validity and being offline
export function AuthGuard({ children }: AuthGuardProps) {
	const segments = useSegments();
	const isAuthenticated = use$(auth$.isAuthenticated);
	const isLoading = use$(auth$.isLoading);

	if (isLoading) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	if (!isAuthenticated && segments[0] !== 'auth') {
		return <Redirect href="/auth/welcome" />;
	}

	return children;
}
