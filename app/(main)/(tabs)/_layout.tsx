import React from 'react';
import { router, Tabs } from 'expo-router';
import { View } from 'react-native';

import { TabBarIcon } from '~/components/icons/TabBarIcon';
import { Button } from '~/components/ui/button';

export default function TabsLayout() {
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
					tabBarLabel: '',
					tabBarStyle: { display: 'none' },
					headerLeft(props) {
						return (
							<Button
								haptics="impact-light"
								variant={'link'}
								hitSlop={20}
								onPressIn={() => router.back()}
								className="flex-row items-center px-5"
							>
								<TabBarIcon name="arrow-back" className="text-foreground" />
							</Button>
						);
					},
					headerTitle: 'Scan QR Code',

					tabBarIcon: ({ color, focused }) => (
						<View className="elevation-md mb-5 h-[65px] w-[65px] items-center justify-center rounded-full bg-primary">
							<TabBarIcon name={focused ? 'qr-code' : 'qr-code-outline'} className="text-white" />
						</View>
					),
				}}
			/>

			<Tabs.Screen
				name="(recent)"
				options={{
					title: 'Recent',
					tabBarStyle: { display: 'none' },
					headerShown: false,
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon name={focused ? 'swap-horizontal-outline' : 'swap-horizontal-outline'} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
