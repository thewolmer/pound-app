import { Redirect, Tabs } from 'expo-router';
import { TabBarIcon } from '~/components/icons/TabBarIcon';
import { useSession } from '~/context/SessionContext';

export default function TabLayout() {
	const { session } = useSession();

	if (!session) {
		return <Redirect href="/auth" />;
	}

	return (
		<Tabs screenOptions={{ headerShown: false }}>
			<Tabs.Screen
				name="index"
				options={{
					title: 'Home',
					tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />,
				}}
			/>
			<Tabs.Screen
				name="(profile)"
				options={{
					headerShown: false,
					title: 'Profile',
					tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />,
				}}
			/>
		</Tabs>
	);
}
