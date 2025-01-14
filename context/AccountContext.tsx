import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import { use$ } from '@legendapp/state/react';

import { supabase } from '~/lib/supabase';
import { auth$ } from '~/stores/auth.store';

interface AccountContextType {
	accountId: string | null;
	balance: number;
	isLoading: boolean;
	error: string | null;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

//TODO: move me to legend state
export function AccountProvider({ children }: { children: ReactNode }) {
	const userId$ = use$(auth$.session.user.id);
	const [accountId, setAccountId] = useState<string | null>(null);
	const [balance, setBalance] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const accountChannel = supabase.channel('account');
		if (accountId) {
			accountChannel
				.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'accounts' }, handleAccountUpdate)
				.subscribe();
		}
		return () => {
			supabase.removeChannel(accountChannel);
		};
	}, [accountId]);

	useEffect(() => {
		if (!userId$) return;

		//TODO: make it multiple accounts
		const getAccount = async () => {
			setIsLoading(true);
			const { data, error } = await supabase.from('accounts').select('id, balance').eq('user_id', userId$).single();
			if (error) {
				console.error(error);
				setError(error.message);
			} else {
				setAccountId(data?.id);
				setBalance(data?.balance || 0);
			}
			setIsLoading(false);
		};

		getAccount();
	}, [userId$]);

	// biome-ignore lint/suspicious/noExplicitAny: FIXME later
	const handleAccountUpdate = (payload: any) => {
		if (payload.new.id === accountId) {
			setBalance(payload.new.balance);
		}
	};

	const value = {
		accountId,
		balance,
		isLoading,
		error,
	};

	return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount() {
	const context = useContext(AccountContext);
	if (context === undefined) {
		throw new Error('useAccount must be used within an AccountProvider');
	}
	return context;
}
