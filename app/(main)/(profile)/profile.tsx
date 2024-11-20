import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ForwardCard } from '~/components/ui/ForwardCard';

import { useSession } from '~/context/SessionContext';
import { supabase } from '~/lib/supabase';
import type { Tables } from '~/types/database.types';

export default function Profile() {
	const { session } = useSession();
	if (!session) return null;

	const [user, setUser] = useState<Tables<'person'> | null>(null);

	useFocusEffect(
		useCallback(() => {
			const fetchData = async () => {
				if (session.user.id) {
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
		}, [session.user.id]),
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
				<ForwardCard
					title={user.first_name || 'You'}
					description={user.email}
					ionicons={user.avatar_url ? undefined : 'person-circle'}
					IconLeft={
						user.avatar_url && (
							<Image
								source={{ uri: user.avatar_url?.toString() }}
								style={{ width: 38, height: 38, borderRadius: 19 }}
								resizeMode="cover"
							/>
						)
					}
					onPress={() => router.push('/(profile)/user')}
				/>
				{/*  */}
				<ForwardCard
					title="Pound Tag"
					description={user.identity_tag !== null ? (user.identity_tag as string) : 'Setup your Pound Tag >'}
					descriptionClassName={user.identity_tag !== null ? 'text-muted-foreground' : 'text-success-foreground'}
					ionicons="id-card"
					onPress={() => router.push('/(profile)/poundTag')}
				/>
			</ScrollView>
		</SafeAreaView>
	);
}
