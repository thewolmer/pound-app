import { router } from 'expo-router';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SendViaContact } from '~/components/send/send-via-contact';
import { SendViaPoundTag } from '~/components/send/send-via-pound-tag';
import { ForwardCard } from '~/components/ui/forward-card';

export default function SendScreen() {
	return (
		<>
			<ScrollView contentInsetAdjustmentBehavior="automatic" className="flex h-full w-full px-5">
				<SafeAreaView>
					<SendViaPoundTag />
					<SendViaContact />
					<ForwardCard
						ionicons="qr-code"
						title="Scan a QR"
						description="Send money by scanning someone's QR code"
						onPress={() => router.push('/scan')}
					/>
				</SafeAreaView>
			</ScrollView>
		</>
	);
}
