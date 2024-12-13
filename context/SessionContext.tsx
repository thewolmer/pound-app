import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { type Session, type User, type WeakPassword } from '@supabase/supabase-js';
import type React from 'react';

import { supabase } from '../lib/supabase';
import { addAuthHeaderToPoundApi } from '~/api/common/pound-api.config';
import type { Tables } from '~/types/database.types';

interface UpdatePersonProps {
	avatar_url?: string | null;
	identity_tag?: string | null;
	fist_name?: string | null;
	last_name?: string | null;
}

interface SessionContextProps {
	session: Session | null;
	person: Tables<'person'> | null;
	updatePerson: (props: UpdatePersonProps) => Promise<void>;
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
	const [person, setPerson] = useState<Tables<'person'> | null>(null);

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			addAuthHeaderToPoundApi(session);
			setSession(session);
		});

		supabase.auth.onAuthStateChange((_event, session) => {
			addAuthHeaderToPoundApi(session);
			setSession(session);
		});
	}, []);

	useEffect(() => {
		if (!session?.user.id) return;

		const getPerson = async () => {
			const { data: personData, error: personError } = await supabase
				.from('person')
				.select('*')
				.eq('id', session?.user.id)
				.single();
			if (personError) {
				console.error(personError);
			}
			setPerson(personData);
		};

		getPerson();
	}, [session]);

	const updatePerson = async (props: UpdatePersonProps) => {
		if (!person?.id) return;
		const { data, error } = await supabase.from('person').update(props).eq('id', person.id).select('*').single();
		if (error) {
			throw error;
		}
		setPerson(data);
	};

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
		<SessionContext.Provider value={{ session, person, updatePerson, setSession, signIn, signUp, signOut }}>
			{children}
		</SessionContext.Provider>
	);
};
