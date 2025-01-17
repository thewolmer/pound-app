import { Ionicons } from '@expo/vector-icons';
import { use$ } from '@legendapp/state/react';
import { router } from 'expo-router';
import { Pressable, Text } from 'react-native';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { BodyView } from '~/components/ui/body-view';
import { ForwardCard } from '~/components/ui/forward-card';
import { user$ } from '~/stores/user.store';

export default function Profile() {
	const first_name$ = use$(user$.user.first_name);
	const last_name$ = use$(user$.user.last_name);
	const identity_tag$ = use$(user$.user.identity_tag);
	const avatar_url$ = use$(user$.user.avatar_url);

	return (
		<BodyView className="p-5">
			<Pressable
				onPress={() => router.push('/(profile)/user')}
				className="flex w-full items-center justify-center gap-1 py-6"
			>
				<Avatar alt="User avatar" className="h-24 w-24">
					<AvatarImage source={{ uri: avatar_url$ ? avatar_url$ : undefined }} />
					<AvatarFallback>
						<Ionicons name="person" size={24} className="text-foreground" />
					</AvatarFallback>
				</Avatar>
				{first_name$ && last_name$ && (
					<Text className={'text-lg font-bold text-foreground'}>
						{first_name$} {last_name$}
					</Text>
				)}
				{identity_tag$ && <Text className={'text-muted-foreground'}>{`@${identity_tag$}`}</Text>}
			</Pressable>

			<ForwardCard
				title="Account"
				description={'Manage your account details'}
				ionicons="person-circle"
				onPress={() => router.push('/(profile)/user')}
			/>
			<ForwardCard
				title="Pound Tag"
				description={identity_tag$ !== null ? (('@' + identity_tag$) as string) : 'Setup your Pound Tag >'}
				descriptionClassName={identity_tag$ !== null ? 'text-muted-foreground' : 'text-success-foreground'}
				ionicons="id-card"
				onPress={() => router.push('/(profile)/pound-tag')}
			/>
			<ForwardCard
				title="Your Cards"
				description={'Manage your cards.'}
				ionicons="card-sharp"
				onPress={() => router.push('/(main)/(deposit)/manage-cards')}
			/>
			<ForwardCard
				title="KYC"
				description={'Verify your identity'}
				ionicons="id-card"
				onPress={() => router.push('/(profile)/kyc')}
			/>
		</BodyView>
	);
}
