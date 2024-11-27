import * as Network from 'expo-network';
import { useEffect, useState } from 'react';

export const useIsOffline = () => {
	const [isOffline, setIsOffline] = useState(false);

	useEffect(() => {
		const checkConnectivity = async () => {
			const networkState = await Network.getNetworkStateAsync();
			setIsOffline(!networkState.isConnected || networkState.type === Network.NetworkStateType.NONE);
		};

		checkConnectivity();

		const interval = setInterval(checkConnectivity, 5000);

		return () => clearInterval(interval);
	}, []);

	return isOffline;
};
