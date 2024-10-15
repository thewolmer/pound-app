import { Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { type Theme, ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NAV_THEME } from '~/constants/theme';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { useColorScheme } from '~/lib/useColorScheme';
import { SessionProvider } from './SessionContext';

const LIGHT_THEME: Theme = {
	dark: false,
	colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
	dark: true,
	colors: NAV_THEME.dark,
};

export const ProvidersWrapper = ({ children }: { children: React.ReactNode }) => {
	const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
	const [fontsLoaded] = useFonts({
		Poppins_400Regular,
		Poppins_600SemiBold,
	});
	const [themeLoaded, setThemeLoaded] = useState(false);
	const [isAppReady, setIsAppReady] = useState(false);

	useEffect(() => {
		const prepare = async () => {
			try {
				await SplashScreen.preventAutoHideAsync();
				const theme = await AsyncStorage.getItem('theme');
				if (Platform.OS === 'web') {
					document.documentElement.classList.add('bg-background');
				}
				if (!theme) {
					AsyncStorage.setItem('theme', colorScheme);
				} else {
					const colorTheme = theme === 'dark' ? 'dark' : 'light';
					if (colorTheme !== colorScheme) {
						setColorScheme(colorTheme);
					}
					setAndroidNavigationBar(colorTheme);
				}
			} catch (error) {
				console.error(error);
			} finally {
				setThemeLoaded(true);
			}
		};

		prepare();
	}, [colorScheme, setColorScheme]);

	useEffect(() => {
		if (fontsLoaded && themeLoaded) {
			setIsAppReady(true);
		}
	}, [fontsLoaded, themeLoaded]);

	const onLayoutRootView = useCallback(async () => {
		if (isAppReady) {
			await SplashScreen.hideAsync();
		}
	}, [isAppReady]);

	if (!isAppReady) {
		return null;
	}

	return (
		<ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
			<StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
			<SafeAreaProvider onLayout={onLayoutRootView} className="bg-red-500">
				<SessionProvider>{children}</SessionProvider>
			</SafeAreaProvider>
			<PortalHost />
		</ThemeProvider>
	);
};
