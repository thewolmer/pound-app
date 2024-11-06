import type { ConfigContext, ExpoConfig } from '@expo/config';

import { ClientEnv, Env } from './env';

export default ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	name: Env.NAME,
	description: `${Env.NAME} Mobile App`,
	owner: Env.EXPO_ACCOUNT_OWNER,
	scheme: Env.SCHEME,
	slug: 'pound',
	version: Env.VERSION.toString(),
	orientation: 'portrait',
	icon: './assets/images/icon.png',
	userInterfaceStyle: 'automatic',
	splash: {
		image: './assets/images/splash.png',
		resizeMode: 'contain',
		backgroundColor: '#0d103f',
		animation: 'fade',
	},
	// updates: {
	// 	fallbackToCacheTimeout: 0,
	// },
	assetBundlePatterns: ['**/*'],
	ios: {
		supportsTablet: true,
		icon: './assets/images/icon.png',
		backgroundColor: '#ffffff',
		bundleIdentifier: Env.BUNDLE_ID,
	},
	android: {
		adaptiveIcon: {
			foregroundImage: './assets/images/adaptive-icon.png',
			backgroundColor: '#ffffff',
		},
		package: Env.PACKAGE,
		googleServicesFile: './google-services.json',
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
			'expo-camera',
			{
				cameraPermission: `Allow ${Env.NAME} to access your camera to scan QR codes.`,
			},
		],
		[
			'expo-notifications',
			{
				icon: './assets/images/notifications-icon.png',
				color: '#ffffff',
				defaultChannel: 'default',
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
