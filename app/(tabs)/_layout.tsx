import { Redirect, Tabs, router } from 'expo-router';
import { View } from 'react-native';
import { Pressable } from 'react-native';
import { TabBarIcon } from '~/components/icons/TabBarIcon';
import { useSession } from '~/context/SessionContext';

export default function TabLayout() {
	const { session } = useSession();

	if (!session) {
		return <Redirect href="/auth" />;
	}

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: 'Home',
					tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />,
				}}
			/>
			<Tabs.Screen
				name="scan"
				options={{
					title: 'Scan',
					headerShown: true,
					headerLeft(props) {
						return (
							<Pressable onPress={() => router.back()} className="flex-row items-center px-5">
								<TabBarIcon name="arrow-back" color="black" />
							</Pressable>
						);
					},
					headerTitle: 'Scan QR Code',
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon name={focused ? 'qr-code' : 'qr-code-outline'} color={color} />
					),
					tabBarStyle: { display: 'none' },
				}}
			/>
			<Tabs.Screen
				name="(profile)"
				options={{
					title: 'Profile',
					headerShown: false,
					tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />,
				}}
			/>
		</Tabs>
	);
}
