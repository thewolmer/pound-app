import { observable } from '@legendapp/state';
import { syncObservable } from '@legendapp/state/sync';

import { persistOptions } from '~/config/legend-state';

interface PreferenceSettings {
	hapticsEnabled: boolean;
	reduceMotion: boolean;
	isDarkTheme: boolean;
	theme: Promise<'light' | 'dark'>;
}

export const preferenceSettings$ = observable<PreferenceSettings>({
	hapticsEnabled: true,
	reduceMotion: false,
	isDarkTheme: true,
	theme: () => (preferenceSettings$.isDarkTheme.get() ? 'dark' : 'light'),
});

syncObservable(
	preferenceSettings$,
	persistOptions({
		persist: {
			name: 'userPreferenceSettings',
		},
	})
);
