import { router } from 'expo-router';

import { SendViaContact } from '~/components/send/send-via-contact';
import { SendViaPoundTag } from '~/components/send/send-via-pound-tag';
import { BodyView } from '~/components/ui/body-view';
import { ForwardCard } from '~/components/ui/forward-card';

export default function SendScreen() {
	return (
		<BodyView className="p-4">
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
