import { useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { useAppStateActive } from './use-app-state-active';

export const useRefetchOnFocus = (
	refetch: () => void,
	/**
	 * Time after refetch function will be refetched
	 * If you don't want to cache the values, you can set this to `0`
	 * **Default**: 1 minute / 60 seconds (60 * 1000)
	 */
	time = 60 * 1000
) => {
	const isFirstRun = useRef(false);
	const lastFetchTime = useRef(Date.now());
	useFocusEffect(
		useCallback(() => {
			if (!isFirstRun.current) {
				isFirstRun.current = true;
				return;
			}

			// Prevents refetching if the last fetch was less than 1 minute ago
			// Boosts performance and prevents unnecessary API calls
			if (Date.now() - lastFetchTime.current < time) {
				return;
			}
			lastFetchTime.current = Date.now();

			refetch();
		}, [refetch, time])
	);

	useAppStateActive(refetch, false);
};
