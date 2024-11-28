import { createContext, useContext, useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { router } from 'expo-router';
import type React from 'react';

interface NetworkContextValue {
	isOffline: boolean;
}

const NetworkContext = createContext<NetworkContextValue | undefined>(undefined);

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [isOffline, setIsOffline] = useState(false);

	useEffect(() => {
		const unsubscribe = NetInfo.addEventListener((state) => {
			const offline = !state.isConnected || state.type === 'none';
			setIsOffline(offline);
			if (offline) {
				router.replace('/offline');
			} else {
				router.replace('/(main)');
			}
		});

		return () => unsubscribe();
	}, []);

	return <NetworkContext.Provider value={{ isOffline }}>{children}</NetworkContext.Provider>;
};

export const useNetwork = () => {
	const context = useContext(NetworkContext);
	if (!context) {
		throw new Error('useNetwork must be used within a NetworkProvider');
	}
	return context;
};
