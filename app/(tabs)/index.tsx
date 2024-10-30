import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AccountBalance } from '~/components/account-balance';

export default function StartScreen() {
	return (
		<SafeAreaView className="flex-1">
			<AccountBalance />
		</SafeAreaView>
	);
}
