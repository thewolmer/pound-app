import AsyncStorage from '@react-native-async-storage/async-storage';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

// Custom AsyncStorage adapter
const asyncStorage = createJSONStorage(() => AsyncStorage);

// Atom with explicit type
export const countAtom = atomWithStorage<number>('counter', 0, asyncStorage);
export const addressAtom = atomWithStorage(
	'address',
	{
		line1: '',
		line2: '',
		city: '',
		state: '',
		country: '',
		postal: '',
	},
	asyncStorage
);
