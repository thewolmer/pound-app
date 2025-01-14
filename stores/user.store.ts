import { observable } from '@legendapp/state';
import { syncObservable } from '@legendapp/state/sync';

import { persistOptions } from '~/config/legend-state';
import { supabase } from '~/lib/supabase';
import { Tables } from '~/types/database.types';

import { auth$ } from './auth.store';

interface UserState {
	user: Tables<'users'> | null;
}

export const user$ = observable<UserState>({
	user: null,
});

syncObservable(
	user$,
	persistOptions({
		persist: {
			name: 'user-store',
		},
	})
);

export const getUser = async () => {
	const userId = auth$.session.get()?.user.id;
	if (!userId) return;

	const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();
	if (error) {
		console.error(error);
	}
	user$.user.set(data);
};

interface UpdateUserProps {
	avatar_url?: string | null;
	identity_tag?: string | null;
	fist_name?: string | null;
	last_name?: string | null;
}
export const updateUser = async (props: UpdateUserProps) => {
	const userId$ = user$.user.get()?.id;
	if (!userId$) return;

	const { data, error } = await supabase.from('users').update(props).eq('id', userId$).select('*').single();
	if (error) {
		console.error(error);
		throw error;
	}
	user$.user.set(data);
};

export const clearUser = () => {
	user$.user.set(null);
};
