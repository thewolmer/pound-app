import 'react-native-url-polyfill/auto';

import { observable } from '@legendapp/state';
import { syncObservable } from '@legendapp/state/sync';
import { createClient } from '@supabase/supabase-js';

import { Env } from '~/config/env';
import { persistOptions } from '~/config/legend-state';
import type { Database } from '~/types/database.types';

interface AuthTokens {
	[key: string]: string;
}

export const tokens$ = observable<AuthTokens>({});

syncObservable(
	tokens$,
	persistOptions({
		persist: {
			name: 'auth-tokens',
		},
	})
);

const legendStorage = {
	getItem(key: string) {
		return tokens$[key].get() || null;
	},
	setItem(key: string, value: string) {
		tokens$[key].set(value);
	},
	removeItem(key: string) {
		tokens$[key].delete();
	},
};

export const supabase = createClient<Database>(Env.EXPO_PUBLIC_SUPABASE_URL, Env.EXPO_PUBLIC_SUPABASE_ANON_KEY, {
	auth: {
		storage: legendStorage,
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: false,
	},
});
