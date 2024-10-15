import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export const getItemFromLocalStorage = async (key: string) => {
	if (Platform.OS === 'web') {
		if (typeof localStorage === 'undefined') {
			return null;
		}
		return localStorage.getItem(key);
	}
	return AsyncStorage.getItem(key);
};

export const removeItemFromLocalStorage = async (key: string) => {
	if (Platform.OS === 'web') {
		return localStorage.removeItem(key);
	}
	return AsyncStorage.removeItem(key);
};

export const setItemToLocalStorage = async (key: string, value: string) => {
	if (Platform.OS === 'web') {
		return localStorage.setItem(key, value);
	}
	return AsyncStorage.setItem(key, value);
};
