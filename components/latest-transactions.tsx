import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useAccount } from '~/context/AccountContext';
import { formatCurrency } from '~/lib/formatCurrency';
import { supabase } from '~/lib/supabase';
import { cn } from '~/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Text } from './ui/text';
//TODO: replace with generated transaction type
interface Transaction {
	id: string;
	type: 'deposit' | 'withdrawal' | 'transfer' | 'payment' | 'purchase';
	amount: number;
	origin_account_id: string;
	destination_account_id: string;
	reference: string;
	status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled' | 'on_hold';
	created_at: Date;
}

interface LatestTransactionsProps {
	count: number;
}

function formatTransactionDate(date: Date): string {
	const now = new Date();
	const transactionDate = new Date(date);

	// Check if the transaction is from today
	if (transactionDate.toDateString() === now.toDateString()) {
		return `Today, ${transactionDate.toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
		})}`;
	}

	// Check if the transaction is from yesterday
	const yesterday = new Date(now);
	yesterday.setDate(yesterday.getDate() - 1);
	if (transactionDate.toDateString() === yesterday.toDateString()) {
		return `Yesterday, ${transactionDate.toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
		})}`;
	}

	// For older dates, show the full date and time
	return transactionDate.toLocaleDateString('en-US', {
		day: 'numeric',
		month: 'short',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	});
}

export function LatestTransactions({ count }: LatestTransactionsProps) {
	const { accountId } = useAccount();
	const [transactions, setTransactions] = useState<Transaction[] | null>([]);

	useEffect(() => {
		//TODO: grab this data from a special view
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

	const renderTransactionIcon = (transaction: Transaction) => {
		if (transaction.type === 'deposit') {
			return (
				<View className="absolute right-0 bottom-0 h-4 w-4 items-center justify-center rounded-full bg-primary">
					<Ionicons name="business-outline" size={10} className="text-primary-foreground" />
				</View>
			);
		}

		if (transaction.type === 'transfer') {
			if (transaction.destination_account_id === accountId) {
				return (
					<View className="absolute right-0 bottom-0 h-4 w-4 items-center justify-center rounded-full bg-primary">
						<Ionicons name="arrow-back-sharp" size={10} className="text-primary-foreground" />
					</View>
				);
			}
			return (
				<View className="absolute right-0 bottom-0 h-4 w-4 items-center justify-center rounded-full bg-primary">
					<Ionicons name="arrow-forward-sharp" size={10} className="text-primary-foreground" />
				</View>
			);
		}

		return null;
	};

	const renderTransaction = ({ item }: { item: Transaction }) => {
		return (
			<View className="flex-row items-center justify-between pb-4">
				<View className="flex-row items-center gap-4">
					<View className="relative h-12 w-12 items-center justify-center rounded-full border border-border bg-muted">
						<Text>IMG</Text>
						{renderTransactionIcon(item)}
					</View>
					<View>
						<Text className="font-bold text-md">Sender/Receiver</Text>
						<Text className="text-muted-foreground text-sm">{formatTransactionDate(new Date(item.created_at))}</Text>
					</View>
				</View>
				<Text
					className={
						item.destination_account_id === accountId ? 'text-success-foreground' : 'text-destructive-foreground'
					}
				>
					{item.destination_account_id === accountId ? '+' : '-'}
					{formatCurrency(item.amount)}
				</Text>
			</View>
		);
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
