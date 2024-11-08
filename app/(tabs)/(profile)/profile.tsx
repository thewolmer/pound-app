import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '~/components/ui/button';
import { Card, CardFooter, CardHeader } from '~/components/ui/card';

import { Text } from '~/components/ui/text';
import { H4 } from '~/components/ui/typography';
import { useSession } from '~/context/SessionContext';
import { supabase } from '~/lib/supabase';

export default function Profile() {
	const { session } = useSession();
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const [user, setUser] = useState<any | null>(null);

	useFocusEffect(
		useCallback(() => {
			const fetchData = async () => {
				if (session?.user?.id) {
					const { data, error } = await supabase.from('person').select().eq('id', session.user.id);
					if (data) {
						setUser(data[0]);
					}
					if (error) {
						alert('Something went wrong');
						console.error(error);
					}
				}
			};

			fetchData();
		}, [session?.user?.id]),
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
				<Card className="mb-3 flex flex-row items-center justify-between px-4">
					<View className="flex flex-row items-center">
						<Ionicons name="person-circle" size={38} className="text-foreground" />
						<View>
							<CardHeader className="pb-0">
								<H4 className="">Your name</H4>
							</CardHeader>
							<CardFooter>
								<Text>{session?.user?.email}</Text>
							</CardFooter>
						</View>
					</View>
					<Button variant={'link'} onPress={() => router.push('/(profile)/user')}>
						<Ionicons name="chevron-forward-outline" size={24} className="text-foreground" />
					</Button>
				</Card>
				{/*  */}
				<Card className="mb-3 flex flex-row items-center justify-between px-4">
					<View className="flex flex-row items-center">
						<Ionicons name="id-card" size={38} className="text-foreground" />
						<View>
							<CardHeader className="pb-0">
								<H4 className="">Pound tag</H4>
							</CardHeader>
							<CardFooter>
								{user.identity_tag !== null ? (
									<Text>{user.identity_tag}</Text>
								) : (
									<Text className="text-green-500">Setup your Pound Tag</Text>
								)}
							</CardFooter>
						</View>
					</View>
					<Button variant={'link'} onPress={() => router.push('/(profile)/poundTag')}>
						<Ionicons name="chevron-forward-outline" size={24} className="text-foreground" />
					</Button>
				</Card>
			</ScrollView>
		</SafeAreaView>
	);
}
