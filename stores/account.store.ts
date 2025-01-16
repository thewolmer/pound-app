import { observable } from '@legendapp/state';
import { syncObservable } from '@legendapp/state/sync';

import { persistOptions } from '~/config/legend-state';
import { supabase } from '~/lib/supabase';

interface AccountState {
	accountId: string | null;
	balance: number;
	isRefreshing: boolean;
}

export const account$ = observable<AccountState>({
	accountId: null,
	balance: 0,
	isRefreshing: false,
});

syncObservable(
	account$,
	persistOptions({
		persist: {
			name: 'account-store',
		},
	})
);

export const refreshAccount = async () => {
	account$.isRefreshing.set(true);
	const { data, error } = await supabase.from('accounts').select('id, balance').single();
	if (error) {
		console.error(error);
		account$.isRefreshing.set(false);
		return;
	}
	account$.set({
		accountId: data.id,
		balance: data.balance,
		isRefreshing: false,
	});
};

export const clearAccount = () => {
	account$.set({
		accountId: null,
		balance: 0,
		isRefreshing: false,
	});
};

const handleAccountUpdate = (payload: any) => {
	account$.balance.set(payload.new.balance);
};

supabase
	.channel('account')
	.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'accounts' }, handleAccountUpdate)
	.subscribe();
