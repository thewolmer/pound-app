import { Link, Stack, usePathname } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '~/components/ui/text';
import { H1 } from '~/components/ui/typography';

export default function NotFoundScreen() {
	const pathname = usePathname();
	return (
		<SafeAreaView>
			<Stack.Screen options={{ title: 'Oops!' }} />
			<View className="p-10">
				<H1>{pathname}</H1>
				<Text>{`This screen doesn't exist.`}</Text>

				<Link href="/">
					<Text>Go to home screen!</Text>
				</Link>
			</View>
		</SafeAreaView>
	);
}
