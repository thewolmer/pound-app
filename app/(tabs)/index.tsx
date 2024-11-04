import { SafeAreaView } from 'react-native-safe-area-context';
import { AccountBalance } from '~/components/account-balance';
import { LatestTransactions } from '~/components/latest-transactions';

export default function StartScreen() {
	return (
		<SafeAreaView className="flex-1 justify-between">
			<AccountBalance />
			<LatestTransactions count={5} />
		</SafeAreaView>
	);
}
