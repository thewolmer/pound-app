import NetInfo from '@react-native-community/netinfo';

import { supabase } from '~/lib/supabase';
import { clearAccount } from '~/stores/account.store';
import { auth$, clearSession, setOffline, setSession } from '~/stores/auth.store';
import { deletePushNotificationToken } from '~/stores/push-notification.store';
import { clearUser, getUser, user$ } from '~/stores/user.store';

export const initializeAuth = async () => {
	const _user$ = user$.user.get();
	const session$ = auth$.session.get();
	const netInfo = await NetInfo.fetch();
	setOffline(!netInfo.isConnected);

	// Set up network state listener
	const netInfoUnsubscribe = NetInfo.addEventListener((state) => {
		setOffline(!state.isConnected);

		// If we're back online and have a session, try to refresh it
		if (state.isConnected && session$) {
			supabase.auth.refreshSession();
		}
	});

	// Set up auth state listener
	const {
		data: { subscription },
	} = supabase.auth.onAuthStateChange((event, session) => {
		if (event === 'SIGNED_OUT') {
			cleanUp();
		} else if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
			setSession(session);
			getUser();
		} else if (event === 'INITIAL_SESSION') {
			setSession(session);
			if (session && !_user$) {
				getUser();
			}
		}
	});

	try {
		const {
			data: { session },
			error,
		} = await supabase.auth.getSession();
		if (error) throw error;

		if (session) {
			setSession(session);
		} else {
			auth$.isLoading.set(false);
		}
	} catch (error) {
		console.warn('Failed to get online session, using cached state:', error);
		auth$.isLoading.set(false);
	}
	// Return cleanup function
	return () => {
		subscription.unsubscribe();
		netInfoUnsubscribe();
	};
};

export const signIn = async (email: string, password: string) => {
	if (auth$.isOffline.get()) {
		throw new Error('Cannot sign in while offline');
	}

	const { data, error } = await supabase.auth.signInWithPassword({ email, password });
	if (error) throw error;
	return data;
};

export const signUp = async (email: string, password: string) => {
	if (auth$.isOffline.get()) {
		throw new Error('Cannot sign up while offline');
	}

	const { data, error } = await supabase.auth.signUp({ email, password });
	if (error) {
		throw error;
	}
	return data;
};

export const signOut = async () => {
	const { error } = await supabase.auth.signOut({ scope: 'local' });

	if (error) {
		console.error('Error signing out:', error);
		await cleanUp();
	}
};

const cleanUp = async () => {
	await deletePushNotificationToken();
	clearUser();
	clearSession();
	clearAccount();
};
