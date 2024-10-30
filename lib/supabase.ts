import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import { Env } from '~/config/env';

const supabaseUrl = Env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = Env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

class SupabaseStorage {
	async getItem(key: string) {
		if (Platform.OS === 'web') {
			if (typeof localStorage === 'undefined') {
				return null;
			}
			return localStorage.getItem(key);
		}
		return AsyncStorage.getItem(key);
	}
	async removeItem(key: string) {
		if (Platform.OS === 'web') {
			return localStorage.removeItem(key);
		}
		return AsyncStorage.removeItem(key);
	}
	async setItem(key: string, value: string) {
		if (Platform.OS === 'web') {
			return localStorage.setItem(key, value);
		}
		return AsyncStorage.setItem(key, value);
	}
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		// https://github.com/supabase/supabase-js/issues/870
		// ...(Platform.OS !== 'web' ? { storage: AsyncStorage } : {}),
		storage: new SupabaseStorage(),
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: false,
	},
});
