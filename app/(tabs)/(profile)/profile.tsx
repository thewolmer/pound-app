import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '~/components/ui/text';
import { useSession } from '~/context/SessionContext';

export default function Profile() {
	const { session } = useSession();

	return (
		<ScrollView contentInsetAdjustmentBehavior="automatic">
			<SafeAreaView className="flex-1 items-center justify-center gap-5 p-6">
				<Text>{session?.user.email}</Text>
			</SafeAreaView>
		</ScrollView>
	);
}
