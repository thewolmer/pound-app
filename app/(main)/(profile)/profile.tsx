import { useCallback, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ForwardCard } from '~/components/ui/forward-card';
import { useSession } from '~/context/SessionContext';
import { supabase } from '~/lib/supabase';
import type { Tables } from '~/types/database.types';

export default function Profile() {
	const { session } = useSession();

	const [user, setUser] = useState<Tables<'person'> | null>(null);

	useFocusEffect(
		useCallback(() => {
			const fetchData = async () => {
				if (session?.user.id) {
					const { data, error } = await supabase.from('person').select().eq('id', session.user.id).single();
					if (data) {
						setUser(data);
					}
					if (error) {
						alert('Something went wrong');
						console.error(error);
					}
				}
			};

			fetchData();
		}, [session?.user.id])
	);

	if (user === null) {
		return (
			<View className="flex-1 items-center justify-center">
				<ActivityIndicator size="large" />
			</View>
		);
	}

	return (
		<SafeAreaView className="w-full flex-1">
			<ScrollView contentInsetAdjustmentBehavior="automatic" className="flex w-full flex-1 p-6">
				<Pressable
					onPress={() => router.push('/(profile)/user')}
					className="flex w-full items-center justify-center gap-1 py-6"
				>
					{user.avatar_url ? (
						<Image
							source={{ uri: user.avatar_url?.toString() }}
							style={{ width: 100, height: 100, borderRadius: 50 }}
							resizeMode="cover"
						/>
					) : (
						<View className="flex h-[100px] w-[100px] items-center justify-center rounded-full bg-accent text-center">
							<View className="text-xl font-extrabold text-foreground">
								<Text>{user.first_name?.[0]}</Text>
							</View>
						</View>
					)}
					{user.first_name && user.last_name && (
						<Text className={'text-lg font-bold text-foreground'}>
							{user.first_name} {user.last_name}
						</Text>
					)}
					{user.identity_tag && <Text className={'text-muted-foreground'}>{`@${user.identity_tag}`}</Text>}
				</Pressable>

				<ForwardCard
					title="Account"
					description={'Manage your account details'}
					ionicons="person-circle"
					onPress={() => router.push('/(profile)/user')}
				/>
				<ForwardCard
					title="Pound Tag"
					description={user.identity_tag !== null ? (('@' + user.identity_tag) as string) : 'Setup your Pound Tag >'}
					descriptionClassName={user.identity_tag !== null ? 'text-muted-foreground' : 'text-success-foreground'}
					ionicons="id-card"
					onPress={() => router.push('/(profile)/poundTag')}
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
