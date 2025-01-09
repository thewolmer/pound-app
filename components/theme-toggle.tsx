import { use$ } from '@legendapp/state/react';
import { useColorScheme } from 'nativewind';

import { preferenceSettings$ } from '~/context/preferences';

import { Switch } from './ui/switch';

export function ThemeToggle() {
	const { toggleColorScheme } = useColorScheme();
	const theme = use$(preferenceSettings$.theme);

	const toggleTheme = () => {
		toggleColorScheme();
		preferenceSettings$.isDarkTheme.toggle();
	};

	return <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />;
}
