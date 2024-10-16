import type { ConfigContext, ExpoConfig } from '@expo/config';

import { ClientEnv, Env } from './env';

export default ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	name: Env.NAME,
	description: `${Env.NAME} Mobile App`,
	owner: Env.EXPO_ACCOUNT_OWNER,
	scheme: Env.SCHEME,
	slug: 'manncoin',
	version: Env.VERSION.toString(),
	orientation: 'portrait',
	icon: './assets/images/icon.png',
	userInterfaceStyle: 'automatic',
	splash: {
		image: './assets/images/splash.png',
		resizeMode: 'contain',
		backgroundColor: '#299FFF',
		animation: 'fade',
	},
	// updates: {
	// 	fallbackToCacheTimeout: 0,
	// },
	assetBundlePatterns: ['**/*'],
	ios: {
		supportsTablet: true,
		bundleIdentifier: Env.BUNDLE_ID,
	},
	android: {
		adaptiveIcon: {
			foregroundImage: './assets/images/adaptive-icon.png',
			backgroundColor: '#299FFF',
		},
		package: Env.PACKAGE,
	},
	web: {
		favicon: './assets/images/favicon.png',
		bundler: 'metro',
		output: 'static',
	},
	experiments: {
		typedRoutes: true,
	},
	plugins: [
		'expo-router',
		[
			'react-native-nfc-manager',
			{
				includeNdefEntitlement: false,
			},
		],
	],
	extra: {
		...ClientEnv,
		eas: {
			projectId: Env.EAS_PROJECT_ID,
		},
	},
});
