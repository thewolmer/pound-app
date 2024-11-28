import { useCallback, useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { type Theme, ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { cssInterop } from 'nativewind';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { NAV_THEME } from '~/constants/theme';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { useColorScheme } from '~/lib/useColorScheme';
import { usePushNotifications } from '~/lib/usePushNotifications';

import { AccountProvider } from './AccountContext';
import { NetworkProvider } from './NetworkContext';
import { PreferenceSettingsProvider } from './PreferenceContext';
import { SessionProvider } from './SessionContext';

cssInterop(Ionicons, { className: 'style' });
cssInterop(SafeAreaView, { className: 'style' });

const LIGHT_THEME: Theme = {
	dark: false,
	colors: NAV_THEME.light,
	fonts: {
		regular: { fontFamily: 'Poppins_400Regular', fontWeight: 'normal' },
		medium: { fontFamily: 'Poppins_600SemiBold', fontWeight: '600' },
		bold: { fontFamily: 'Poppins_600SemiBold', fontWeight: '600' },
		heavy: { fontFamily: 'Poppins_600SemiBold', fontWeight: '600' },
	},
};
const DARK_THEME: Theme = {
	dark: true,
	colors: NAV_THEME.dark,
	fonts: {
		regular: { fontFamily: 'Poppins_400Regular', fontWeight: 'normal' },
		medium: { fontFamily: 'Poppins_600SemiBold', fontWeight: '600' },
		bold: { fontFamily: 'Poppins_600SemiBold', fontWeight: '600' },
		heavy: { fontFamily: 'Poppins_600SemiBold', fontWeight: '600' },
	},
};

export const ProvidersWrapper = ({ children }: { children: React.ReactNode }) => {
	usePushNotifications();
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
					await AsyncStorage.setItem('theme', colorScheme);
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
			<PreferenceSettingsProvider>
				<GestureHandlerRootView>
					<BottomSheetModalProvider>
						<StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
						<SafeAreaProvider onLayout={onLayoutRootView}>
							<NetworkProvider>
								<SessionProvider>
									<AccountProvider>{children}</AccountProvider>
								</SessionProvider>
							</NetworkProvider>
						</SafeAreaProvider>
						<PortalHost />
					</BottomSheetModalProvider>
				</GestureHandlerRootView>
			</PreferenceSettingsProvider>
		</ThemeProvider>
	);
};
