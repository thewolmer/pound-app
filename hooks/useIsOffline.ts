import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

export const useIsOffline = () => {
	const [isOffline, setIsOffline] = useState(false);

	useEffect(() => {
		const unsubscribe = NetInfo.addEventListener((state) => {
			setIsOffline(!state.isConnected || state.type === 'none');
		});

		return () => unsubscribe();
	}, []);

	return isOffline;
};
