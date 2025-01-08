import AsyncStorage from '@react-native-async-storage/async-storage';

import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { useColorScheme } from '~/lib/useColorScheme';

import { Switch } from './ui/switch';

export function ThemeToggle() {
	const { isDarkColorScheme, setColorScheme } = useColorScheme();
	return (
		<Switch
			checked={isDarkColorScheme}
			onCheckedChange={async () => {
				const newTheme = isDarkColorScheme ? 'light' : 'dark';
				setColorScheme(newTheme);
				setAndroidNavigationBar(newTheme);
				await AsyncStorage.setItem('theme', newTheme);
			}}
		/>
	);
}
