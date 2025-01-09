import '~/config/reanimated.config';

import { useCallback, useEffect, useState } from 'react';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { use$ } from '@legendapp/state/react';
import { type Theme, ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { cssInterop, useColorScheme } from 'nativewind';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { APIProvider } from '~/api/common/api-provider';
import { NAV_THEME } from '~/constants/theme';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { useEffectOnce } from '~/lib/use-effect-once';
import { usePushNotifications } from '~/lib/usePushNotifications';

import { AccountProvider } from './AccountContext';
import { NetworkProvider } from './NetworkContext';
import { preferenceSettings$ } from './preferences';
import { SessionProvider } from './SessionContext';

cssInterop(Ionicons, { className: 'style' });
cssInterop(FontAwesome5, { className: 'style' });
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
	const { setColorScheme } = useColorScheme();
	const [fontsLoaded] = useFonts({
		Poppins_400Regular,
		Poppins_600SemiBold,
	});
	const isDarkTheme = use$(preferenceSettings$.isDarkTheme);
	const theme = use$(preferenceSettings$.theme);

	const [isAppReady, setIsAppReady] = useState(false);

	if (Platform.OS === 'web') {
		document.documentElement.classList.add('bg-background');
	}

	useEffectOnce(() => {
		setColorScheme(theme);
		setAndroidNavigationBar(theme);
	});

	useEffect(() => {
		if (fontsLoaded) {
			setIsAppReady(true);
		}
	}, [fontsLoaded]);

	const onLayoutRootView = useCallback(async () => {
		if (isAppReady) {
			await SplashScreen.hideAsync();
		}
	}, [isAppReady]);

	if (!isAppReady) {
		return null;
	}

	return (
		<APIProvider>
			<ThemeProvider value={isDarkTheme ? DARK_THEME : LIGHT_THEME}>
				<GestureHandlerRootView>
					<BottomSheetModalProvider>
						<StatusBar style={isDarkTheme ? 'light' : 'dark'} />
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
			</ThemeProvider>
		</APIProvider>
	);
};
