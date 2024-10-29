import * as Haptics from 'expo-haptics';

export const useHaptics = (
	type:
		| 'impact-light'
		| 'impact-medium'
		| 'impact-heavy'
		| 'notification-success'
		| 'notification-warning'
		| 'notification-error',
) => {
	const hapticsMap = {
		'impact-light': Haptics.ImpactFeedbackStyle.Light,
		'impact-medium': Haptics.ImpactFeedbackStyle.Medium,
		'impact-heavy': Haptics.ImpactFeedbackStyle.Heavy,
		'notification-success': Haptics.NotificationFeedbackType.Success,
		'notification-warning': Haptics.NotificationFeedbackType.Warning,
		'notification-error': Haptics.NotificationFeedbackType.Error,
	};

	if (type.startsWith('impact')) {
		return Haptics.impactAsync(hapticsMap[type] as Haptics.ImpactFeedbackStyle);
	}
	return Haptics.notificationAsync(hapticsMap[type] as Haptics.NotificationFeedbackType);
};
