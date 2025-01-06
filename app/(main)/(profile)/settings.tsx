import type React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemeToggle } from '~/components/ThemeToggle';
import { Button } from '~/components/ui/button';
import { Switch } from '~/components/ui/switch';
import { Text } from '~/components/ui/text';
import { P } from '~/components/ui/typography';
import { type PreferenceSettings, usePreferenceSettings } from '~/context/PreferenceContext';
import { useSession } from '~/context/SessionContext';

export default function Settings() {
	const { session, signOut } = useSession();

	return (
		<ScrollView contentInsetAdjustmentBehavior="automatic">
			<SafeAreaView className="flex-1 p-6">
				<SettingsCard title="Dark Theme" description="Toggle Dark theme">
					<ThemeToggle />
				</SettingsCard>
				<SettingsCard
					title="Haptics"
					description="Toggle vibrations and haptic feedbacks within app"
					settingsKey="hapticsEnabled"
				/>
				<SettingsCard title="Reduced Motion" description="Disable animations" settingsKey="reduceMotion" />
				<SettingsCard title={session?.user.email as string} description="Remove your account from this device">
					<Button variant="destructive" onPress={signOut} className="flex-row items-center gap-1">
						<Text>Sign Out</Text>
					</Button>
				</SettingsCard>
			</SafeAreaView>
		</ScrollView>
	);
}

type SettingsCardProps =
	| {
			title: string;
			description: string;
			settingsKey: keyof Omit<PreferenceSettings, 'theme'>;
			children?: undefined;
	  }
	| {
			title: string;
			description: string;
			children: React.ReactNode;
			settingsKey?: undefined;
	  };

const SettingsCard = ({ title, description, children, settingsKey }: SettingsCardProps) => {
	const { preferenceSettings, updatePreferenceSetting } = usePreferenceSettings();
	const isBooleanSetting = settingsKey && typeof preferenceSettings[settingsKey] === 'boolean';

	return (
		<View className="my-4 w-full flex-row items-center justify-between gap-3">
			<View className="w-[70%]">
				<Text className="text-lg font-bold">{title}</Text>
				<P className="text-sm text-muted-foreground">{description}</P>
			</View>
			{children ? (
				children
			) : isBooleanSetting ? (
				<Switch
					checked={preferenceSettings[settingsKey] as boolean}
					onCheckedChange={(value) => updatePreferenceSetting(settingsKey, value)}
				/>
			) : null}
		</View>
	);
};
