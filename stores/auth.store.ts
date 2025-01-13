import { observable } from '@legendapp/state';
import { syncObservable } from '@legendapp/state/sync';
import { Session } from '@supabase/supabase-js';

import { addAuthHeaderToPoundApi } from '~/api/common/pound-api.config';
import { persistOptions } from '~/config/legend-state';

interface AuthState {
	session: Session | null;
	isLoading: boolean;
	isAuthenticated: Promise<boolean>;
	isOffline: boolean;
}

export const auth$ = observable<AuthState>({
	session: null,
	isLoading: true,
	isAuthenticated: () => auth$.session.get() !== null,
	isOffline: false,
});

syncObservable(
	auth$,
	persistOptions({
		persist: {
			name: 'auth-store',
		},
	})
);

export const setSession = (session: Session | null) => {
	addAuthHeaderToPoundApi(session);
	auth$.session.set(session);
	auth$.isLoading.set(false);
};

export const clearSession = () => {
	auth$.session.set(null);
	auth$.isLoading.set(false);
};

export const setOffline = (isOffline: boolean) => {
	auth$.isOffline.set(isOffline);
};

export const isSessionValid = (session: Session | null): boolean => {
	if (!session?.expires_at) return false;
	return Date.now() < session.expires_at * 1000;
};
