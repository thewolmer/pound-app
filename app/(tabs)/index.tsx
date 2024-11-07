import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AccountBalance } from '~/components/account-balance';
import { TabBarIcon } from '~/components/icons/TabBarIcon';
import { LatestTransactions } from '~/components/latest-transactions';

export default function StartScreen() {
	return (
		<SafeAreaView className="flex-1 gap-5">
			<View className="flex flex-row items-center justify-between px-2 text-foreground">
				<Text className="text-foreground"> Welcome</Text>
				<Pressable onPress={() => router.navigate('/(profile)')} className="px-5">
					<TabBarIcon name="person" className="text-foreground" />
				</Pressable>
			</View>
			<AccountBalance />
			<LatestTransactions count={5} />
		</SafeAreaView>
	);
}
