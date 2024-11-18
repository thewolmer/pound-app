import type { ConfigContext, ExpoConfig } from '@expo/config';

import type { AppIconBadgeConfig } from 'app-icon-badge/types';
import { ClientEnv, Env } from './env';

const appIconBadgeConfig: AppIconBadgeConfig = {
	enabled: Env.APP_ENV === 'staging', // enable/ disable the plugin based on the environment (usually disabled for production builds)
	badges: [
		{
			text: Env.APP_ENV,
			type: 'banner',
			color: 'white', // by default it will be white and the only color supported for now is white and black
		},
		{
			text: Env.VERSION.toString(),
			type: 'ribbon',
		},
	],
};
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
	newArchEnabled: true,
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
		['expo-font'],
		[
			'expo-notifications',
			{
				icon: './assets/images/notifications-icon.png',
				color: '#764aff',
				defaultChannel: 'default',
			},
		],

		['app-icon-badge', appIconBadgeConfig],
		[
			'expo-contacts',
			{
				contactsPermission: `Allow ${Env.NAME} to access your contacts to make payments.`,
			},
		],
		[
			'expo-image-picker',
			{
				photosPermission: `Allow ${Env.NAME} to access your photos to upload a profile picture.`,
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
