import * as Haptics from 'expo-haptics';

import { usePreferenceSettings } from '~/context/PreferenceContext';

type HapticType =
	| 'impact-light'
	| 'impact-medium'
	| 'impact-heavy'
	| 'notification-success'
	| 'notification-warning'
	| 'notification-error';

export const useHaptics = () => {
	const { preferenceSettings } = usePreferenceSettings();

	const triggerHaptics = async (type: HapticType) => {
		if (!preferenceSettings.hapticsEnabled) return;

		const hapticsMap = {
			'impact-light': Haptics.ImpactFeedbackStyle.Light,
			'impact-medium': Haptics.ImpactFeedbackStyle.Medium,
			'impact-heavy': Haptics.ImpactFeedbackStyle.Heavy,
			'notification-success': Haptics.NotificationFeedbackType.Success,
			'notification-warning': Haptics.NotificationFeedbackType.Warning,
			'notification-error': Haptics.NotificationFeedbackType.Error,
		};

		if (type.startsWith('impact')) {
			await Haptics.impactAsync(hapticsMap[type] as Haptics.ImpactFeedbackStyle);
		} else {
			await Haptics.notificationAsync(hapticsMap[type] as Haptics.NotificationFeedbackType);
		}
	};

	return { triggerHaptics };
};
