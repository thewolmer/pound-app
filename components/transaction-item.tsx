import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { useAccount } from '~/context/AccountContext';
import { formatCurrency } from '~/lib/formatCurrency';
import { formatTransactionDate } from '~/lib/utils';
import type { Tables } from '~/types/database.types';

export function TransactionItem({
	item,
	showDate = true,
}: { item: Tables<'account_transactions'>; showDate?: boolean }) {
	const { accountId } = useAccount();

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

	return (
		<View className="flex-row items-center justify-between pb-4">
			<View className="flex-row items-center gap-4">
				<View className="relative h-12 w-12 items-center justify-center rounded-full border border-border bg-muted">
					<Text className="text-foreground">IMG</Text>
					{renderTransactionIcon(item)}
				</View>
				<View>
					<Text className="font-bold text-md text-muted-foreground">{renderTransactionParticipant(item)}</Text>
					{showDate && (
						<Text className="text-muted-foreground text-sm">
							{formatTransactionDate(new Date(item.created_at || ''))}
						</Text>
					)}
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
}
