import { useEffect, useState } from 'react';
import { FlatList } from 'react-native';

import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { useAccount } from '~/context/AccountContext';
import { supabase } from '~/lib/supabase';
import type { Tables } from '~/types/database.types';

import { TransactionItem } from './transaction-item';

interface LatestTransactionsProps {
	count: number;
}

export function LatestTransactions({ count }: LatestTransactionsProps) {
	const { accountId } = useAccount();
	const [transactions, setTransactions] = useState<Tables<'account_transactions'>[] | null>([]);

	useEffect(() => {
		const getTransactions = async () => {
			const { data, error } = await supabase
				.from('account_transactions')
				.select('*')
				.or(`origin_account_id.eq.${accountId},destination_account_id.eq.${accountId}`)
				.order('created_at', { ascending: false })
				.limit(count);
			if (error) console.error(error);
			setTransactions(data);
		};
		if (accountId) {
			getTransactions();

			supabase
				.channel('transaction')
				.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'transaction' }, getTransactions)
				.subscribe();
		}
	}, [accountId, count]);

	const renderTransaction = ({ item }: { item: Tables<'account_transactions'> }) => {
		return <TransactionItem item={item} />;
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg">Latest Transactions</CardTitle>
			</CardHeader>
			<CardContent>
				<FlatList
					data={transactions}
					renderItem={renderTransaction}
					keyExtractor={(item) => item.id || Math.random().toString()}
				/>
			</CardContent>
		</Card>
	);
}
