import AsyncStorage from '@react-native-async-storage/async-storage';
import { type Session, type User, type WeakPassword, isAuthApiError } from '@supabase/supabase-js';
import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface SessionContextProps {
	session: Session | null;
	signIn: (email: string, password: string) => Promise<{ user: User; session: Session; weakPassword?: WeakPassword }>;
	signUp: (email: string, password: string) => Promise<{ user: User | null; session: Session | null }>;
	signOut: () => Promise<void>;
	setSession: React.Dispatch<React.SetStateAction<Session | null>>;
}

const SessionContext = createContext<SessionContextProps | undefined>(undefined);

export const useSession = () => {
	const context = useContext(SessionContext);
	if (context === undefined) {
		throw new Error('useSession must be used within a SessionProvider');
	}
	return context;
};

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [session, setSession] = useState<Session | null>(null);

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
		});

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});
	}, []);

	const clearData = async () => {
		const pushToken = await AsyncStorage.getItem('pushToken');
		if (pushToken) {
			await supabase.from('expo_push_token').delete().eq('expo_push_token', pushToken);
			await AsyncStorage.removeItem('pushToken');
		}
	};

	const signIn = async (email: string, password: string) => {
		const { data, error } = await supabase.auth.signInWithPassword({ email, password });
		if (error) {
			throw error;
		}
		return data;
	};

	const signUp = async (email: string, password: string) => {
		const { data, error } = await supabase.auth.signUp({ email, password });
		if (error) {
			throw error;
		}
		return data;
	};

	const signOut = async () => {
		if (session) {
			await clearData();
			const { error } = await supabase.auth.signOut({ scope: 'local' });
			if (error) {
				throw error;
			}
		}
	};

	// const getGoogleOAuthUrl = async (): Promise<string | null> => {
	// 	const { data, error } = await supabase.auth.signInWithOAuth({
	// 		provider: 'google',
	// 		options: {
	// 			redirectTo: 'pound://google-auth',
	// 			skipBrowserRedirect: true,
	// 		},
	// 	});

	// 	if (error) {
	// 		throw error;
	// 	}

	// 	return data.url;
	// };

	// const setOAuthSession = async (tokens: { access_token: string; refresh_token: string }) => {
	// 	const { data, error } = await supabase.auth.setSession({
	// 		access_token: tokens.access_token,
	// 		refresh_token: tokens.refresh_token,
	// 	});
	// 	if (error) {
	// 		throw error;
	// 	}
	// 	return data;
	// };

	return (
		<SessionContext.Provider value={{ session, setSession, signIn, signUp, signOut }}>
			{children}
		</SessionContext.Provider>
	);
};
