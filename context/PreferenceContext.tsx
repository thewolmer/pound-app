import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useNativewindColorScheme } from 'nativewind';
import { createContext, useContext, useEffect, useState } from 'react';

type ThemePreference = 'light' | 'dark';

export type PreferenceSettings = {
	hapticsEnabled: boolean;
	reduceMotion: boolean;
	theme: ThemePreference;
};

type PreferenceSettingsContextType = {
	preferenceSettings: PreferenceSettings;
	updatePreferenceSetting: (key: keyof PreferenceSettings, value: boolean | ThemePreference) => void;
};

const PreferenceSettingsContext = createContext<PreferenceSettingsContextType | undefined>(undefined);

const defaultPreferenceSettings: PreferenceSettings = {
	hapticsEnabled: true,
	reduceMotion: false,
	theme: 'light',
};

export const PreferenceSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { colorScheme, setColorScheme } = useNativewindColorScheme();
	const [preferenceSettings, setPreferenceSettings] = useState<PreferenceSettings>({
		...defaultPreferenceSettings,
		theme: colorScheme as ThemePreference,
	});

	useEffect(() => {
		const loadPreferenceSettings = async () => {
			const storedPreferenceSettings = await AsyncStorage.getItem('userPreferenceSettings');
			if (storedPreferenceSettings) {
				setPreferenceSettings(JSON.parse(storedPreferenceSettings));
			}
		};
		loadPreferenceSettings();
	}, []);

	const updatePreferenceSetting = async (key: keyof PreferenceSettings, value: boolean | ThemePreference) => {
		const newPreferenceSettings = { ...preferenceSettings, [key]: value };
		setPreferenceSettings(newPreferenceSettings);

		if (key === 'theme') {
			setColorScheme(value as ThemePreference);
		}

		await AsyncStorage.setItem('userPreferenceSettings', JSON.stringify(newPreferenceSettings));
	};

	return (
		<PreferenceSettingsContext.Provider value={{ preferenceSettings, updatePreferenceSetting }}>
			{children}
		</PreferenceSettingsContext.Provider>
	);
};

export const usePreferenceSettings = () => {
	const context = useContext(PreferenceSettingsContext);
	if (!context) {
		throw new Error('usePreferenceSettings must be used within a PreferenceSettingsProvider');
	}
	return context;
};
