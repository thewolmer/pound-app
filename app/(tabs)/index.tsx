import { Redirect } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { H1, H2 } from '~/components/ui/typography';
import { useSession } from '~/context/SessionContext';

export default function StartScreen() {
	return (
		<SafeAreaView className="flex-1 items-center justify-center gap-5 p-6">
			<H1>Hello</H1>
		</SafeAreaView>
	);
}
