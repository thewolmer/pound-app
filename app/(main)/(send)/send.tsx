import { router } from 'expo-router';
import { View } from 'react-native';

import { SendMoneyToAFriend } from '~/assets/illustrations/send-money-to-a-friend';
import { SendViaContact } from '~/components/send/send-via-contact';
import { SendViaPoundTag } from '~/components/send/send-via-pound-tag';
import { BodyView } from '~/components/ui/body-view';
import { ForwardCard } from '~/components/ui/forward-card';

export default function SendScreen() {
	return (
		<BodyView scrollable className="p-4">
			<View className="flex w-fit items-center justify-center">
				<SendMoneyToAFriend width={250} height={250} />
			</View>
			<SendViaPoundTag />
			<SendViaContact />
			<ForwardCard
				ionicons="qr-code"
				title="Scan a QR"
				description="Send money by scanning someone's QR code"
				onPress={() => router.push('/scan')}
			/>
		</BodyView>
	);
}
