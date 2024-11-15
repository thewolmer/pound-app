import { router } from 'expo-router';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SendViaContact } from '~/components/send/SendViaContact';
import { SendViaPoundTag } from '~/components/send/SendViaPoundTag';
import { ForwardCard } from '~/components/ui/ForwardCard';

export default function SendScreen() {
	return (
		<>
			<ScrollView contentInsetAdjustmentBehavior="automatic" className="flex h-full w-full px-5">
				<SafeAreaView>
					<SendViaPoundTag />
					<SendViaContact />
					<ForwardCard
						ionicons="qr-code"
						title="Send by scanning QR"
						description="Send money by scanning someone QR code"
						onPress={() => router.push('/scan')}
					/>
				</SafeAreaView>
			</ScrollView>
		</>
	);
}
