import { observablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage';
import { configureSynced } from '@legendapp/state/sync';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const persistOptions = configureSynced({
	persist: {
		plugin: observablePersistAsyncStorage({
			AsyncStorage,
		}),
	},
});
