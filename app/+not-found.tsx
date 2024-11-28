import { Link, Stack, usePathname } from 'expo-router';
import { View } from 'react-native';

import { Text } from '~/components/ui/text';
import { H1 } from '~/components/ui/typography';

export default function NotFoundScreen() {
	const pathname = usePathname();
	return (
		<>
			<Stack.Screen options={{ title: 'Oops!' }} />
			<View>
				<H1>{pathname}</H1>
				<Text>{`This screen doesn't exist.`}</Text>

				<Link href="/">
					<Text>Go to home screen!</Text>
				</Link>
			</View>
		</>
	);
}
