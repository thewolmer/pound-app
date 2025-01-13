import { use$ } from '@legendapp/state/react';
import { router } from 'expo-router';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ForwardCard } from '~/components/ui/forward-card';
import { user$ } from '~/stores/user.store';

export default function Profile() {
	const first_name$ = use$(user$.user.first_name);
	const last_name$ = use$(user$.user.last_name);
	const identity_tag$ = use$(user$.user.identity_tag);
	const avatar_url$ = use$(user$.user.avatar_url);

	return (
		<SafeAreaView className="w-full flex-1">
			<ScrollView contentInsetAdjustmentBehavior="automatic" className="flex w-full flex-1 p-6">
				<Pressable
					onPress={() => router.push('/(profile)/user')}
					className="flex w-full items-center justify-center gap-1 py-6"
				>
					{avatar_url$ ? (
						<Image
							source={{ uri: avatar_url$.toString() }}
							style={{ width: 100, height: 100, borderRadius: 50 }}
							resizeMode="cover"
						/>
					) : (
						<View className="flex h-[100px] w-[100px] items-center justify-center rounded-full bg-accent text-center">
							<View className="text-xl font-extrabold text-foreground">
								<Text>{first_name$?.[0]}</Text>
							</View>
						</View>
					)}
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
			</ScrollView>
		</SafeAreaView>
	);
}
