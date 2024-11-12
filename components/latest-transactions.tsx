import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useAccount } from '~/context/AccountContext';
import { formatCurrency } from '~/lib/formatCurrency';
import { supabase } from '~/lib/supabase';
import type { Tables } from '~/types/database.types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Text } from './ui/text';

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

	const renderTransactionIcon = (transaction: Tables<'account_transactions'>) => {
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

	const renderTransactionParticipant = (transaction: Tables<'account_transactions'>) => {
		if (transaction.type === 'deposit') {
			return 'Bank deposit';
		}
		if (transaction.type === 'transfer') {
			if (transaction.destination_account_id === accountId) {
				return `${transaction.origin_first_name} ${transaction.origin_last_name}`;
			}
			return `${transaction.destination_first_name} ${transaction.destination_last_name}`;
		}

		return '';
	};

	const renderTransaction = ({ item }: { item: Tables<'account_transactions'> }) => {
		return (
			<View className="flex-row items-center justify-between pb-4">
				<View className="flex-row items-center gap-4">
					<View className="relative h-12 w-12 items-center justify-center rounded-full border border-border bg-muted">
						<Text>IMG</Text>
						{renderTransactionIcon(item)}
					</View>
					<View>
						<Text className="font-bold text-md">{renderTransactionParticipant(item)}</Text>
						<Text className="text-muted-foreground text-sm">
							{formatTransactionDate(new Date(item.created_at || ''))}
						</Text>
					</View>
				</View>
				<Text
					className={
						item.destination_account_id === accountId ? 'text-success-foreground' : 'text-destructive-foreground'
					}
				>
					{item.destination_account_id === accountId ? '+' : '-'}
					{formatCurrency(item.amount || 0)}
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
				<FlatList
					data={transactions}
					renderItem={renderTransaction}
					keyExtractor={(item) => item.id || Math.random().toString()}
				/>
			</CardContent>
		</Card>
	);
}
