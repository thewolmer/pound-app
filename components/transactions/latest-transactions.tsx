import { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';

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
	const [isLoading, setLoading] = useState(false);

	useEffect(() => {
		const getTransactions = async () => {
			setLoading(true);
			const { data, error } = await supabase
				.from('account_transactions')
				.select('*')
				.or(`origin_account_id.eq.${accountId},destination_account_id.eq.${accountId}`)
				.order('created_at', { ascending: false })
				.limit(count);
			setLoading(false);
			if (error) console.error(error);
			setTransactions(data);
		};
		if (accountId) {
			getTransactions();

			supabase
				.channel('transaction')
				.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'transactions' }, getTransactions)
				.subscribe();
		}
	}, [accountId, count]);

	const renderTransaction = ({ item }: { item: Tables<'account_transactions'> }) => {
		return <TransactionItem item={item} />;
	};

	return (
		<Card className="">
			<CardHeader>
				<CardTitle className="text-lg">Latest Transactions</CardTitle>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					Array.from({ length: count }).map((_, index) => (
						<View key={index} className="flex-row items-center justify-between border-b border-border p-2">
							<View className="flex-row items-center gap-4">
								<View className="relative h-12 w-12 animate-pulse rounded-2xl bg-muted p-2"></View>

								<View className="flex gap-2">
									<View className="animate-pulse rounded-full bg-muted px-14 py-2" />
									<View className="animate-pulse rounded-full bg-muted px-4 py-1" />
								</View>
							</View>
							<View className="animate-pulse rounded-2xl bg-muted px-8 py-4" />
						</View>
					))
				) : (
					<FlatList
						data={transactions}
						renderItem={renderTransaction}
						scrollEnabled={false}
						nestedScrollEnabled
						keyExtractor={(item) => item.id || Math.random().toString()}
					/>
				)}
			</CardContent>
		</Card>
	);
}
