import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { useAccount } from '~/context/AccountContext';
import { formatCurrency } from '~/lib/formatCurrency';
import { formatTransactionDate } from '~/lib/utils';

// TODO: replace with generated transaction type
export interface Transaction {
	id: string;
	type:
		| 'deposit'
		| 'withdrawal'
		| 'transfer'
		| 'payment'
		| 'purchase'
		| 'refund'
		| 'fee'
		| 'interest'
		| 'cashback'
		| 'adjustment'
		| 'chargeback'
		| 'reversal';
	amount: number;
	origin_account_id: string | null;
	destination_account_id: string | null;
	reference: string;
	status:
		| 'pending'
		| 'in_progress'
		| 'completed'
		| 'failed'
		| 'on_hold'
		| 'canceled'
		| 'reversed'
		| 'expired'
		| 'refunded';
	created_at: string;
}

export function TransactionItem({ item, showDate = true }: { item: Transaction; showDate?: boolean }) {
	const { accountId } = useAccount();

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

	return (
		<View className="flex-row items-center justify-between pb-4">
			<View className="flex-row items-center gap-4">
				<View className="relative h-12 w-12 items-center justify-center rounded-full border border-border bg-muted">
					<Text className="text-foreground">IMG</Text>
					{renderTransactionIcon(item)}
				</View>
				<View>
					<Text className="font-bold text-md text-muted-foreground">Sender/Receiver</Text>
					{showDate && (
						<Text className="text-muted-foreground text-sm">{formatTransactionDate(new Date(item.created_at))}</Text>
					)}
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
}
