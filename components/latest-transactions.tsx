import { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { useAccount } from '~/context/AccountContext';

import { supabase } from '~/lib/supabase';

import { type Transaction, TransactionItem } from './transaction-item';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface LatestTransactionsProps {
	count: number;
}

export function LatestTransactions({ count }: LatestTransactionsProps) {
	const { accountId } = useAccount();
	const [transactions, setTransactions] = useState<Transaction[] | null>([]);

	useEffect(() => {
		const getTransactions = async () => {
			const { data, error } = await supabase
				.from('transaction')
				.select('*')
				.or(`origin_account_id.eq.${accountId},destination_account_id.eq.${accountId}`)
				.order('created_at', { ascending: false })
				.limit(count);
			if (error) console.error(error);
			// console.log(data);
			setTransactions(data);
		};
		if (accountId) {
			getTransactions();

			supabase
				.channel('transaction')
				.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'transaction' }, handleTransactionInsert)
				.subscribe();
		}
	}, [accountId, count]);

	// biome-ignore lint/suspicious/noExplicitAny: fix with correct type
	const handleTransactionInsert = (payload: any) => {
		if (payload.new.origin_account_id === accountId || payload.new.destination_account_id === accountId) {
			setTransactions((prevTransactions) => [
				payload.new,
				...(prevTransactions?.length === count ? prevTransactions.slice(0, -1) : prevTransactions || []),
			]);
		}
	};

	const renderTransaction = ({ item }: { item: Transaction }) => {
		return <TransactionItem item={item} />;
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg">Latest Transactions</CardTitle>
			</CardHeader>
			<CardContent>
				<FlatList data={transactions} renderItem={renderTransaction} keyExtractor={(item) => item.id} />
			</CardContent>
		</Card>
	);
}
