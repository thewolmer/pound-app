import { observable } from '@legendapp/state';
import { syncObservable } from '@legendapp/state/sync';

import { persistOptions } from '~/config/legend-state';

interface PreferenceSettingsState {
	hapticsEnabled: boolean;
	reduceMotion: boolean;
	isDarkTheme: boolean;
	theme: Promise<'light' | 'dark'>;
}

export const preferenceSettings$ = observable<PreferenceSettingsState>({
	hapticsEnabled: true,
	reduceMotion: false,
	isDarkTheme: true,
	theme: () => (preferenceSettings$.isDarkTheme.get() ? 'dark' : 'light'),
});

syncObservable(
	preferenceSettings$,
	persistOptions({
		persist: {
			name: 'preference-settings',
		},
	})
);
