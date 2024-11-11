import { format, isToday, isYesterday, parseISO } from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { SectionList } from 'react-native';
import { RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { type Transaction, TransactionItem } from '~/components/transaction-item';
import { useAccount } from '~/context/AccountContext';
import { formatCurrency } from '~/lib/formatCurrency';
import { supabase } from '~/lib/supabase';

interface TransactionSection {
	title: string;
	data: Transaction[];
}

export default function Recent() {
	const { accountId } = useAccount();
	const [transactions, setTransactions] = useState<TransactionSection[]>([]);
	const [refreshing, setRefreshing] = useState(false);
	// const headerHeight = useHeaderHeight();

	const fetchTransactions = async () => {
		if (!accountId) return;
		const { data, error } = await supabase
			.from('transaction')
			.select('*')
			.or(`origin_account_id.eq.${accountId},destination_account_id.eq.${accountId}`)
			.order('created_at', { ascending: false });

		if (error) {
			console.error(error);
			alert('Something went wrong');
			return;
		}

		if (data) setTransactions(groupTransactionsByDate(data as Transaction[]));
	};

	const groupTransactionsByDate = (data: Transaction[]): TransactionSection[] => {
		return data.reduce<TransactionSection[]>((sections, transaction) => {
			const date = parseISO(transaction.created_at);
			let sectionTitle: string;
			if (isToday(date)) {
				sectionTitle = 'Today';
			} else if (isYesterday(date)) {
				sectionTitle = 'Yesterday';
			} else {
				sectionTitle = format(date, 'MMMM d, yyyy');
			}

			const section = sections.find((s) => s.title === sectionTitle);
			if (section) {
				section.data.push(transaction);
			} else {
				sections.push({ title: sectionTitle, data: [transaction] });
			}

			return sections;
		}, []);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		fetchTransactions();
	}, [accountId]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await fetchTransactions();
		setRefreshing(false);
	}, [accountId]);

	const renderTransaction = ({ item }: { item: Transaction }) => {
		return (
			<View className="px-5">
				<TransactionItem item={item} showDate={false} />
			</View>
		);
	};

	const renderSectionHeader = ({ section }: { section: TransactionSection }) => {
		const totalAmount = section.data.reduce((sum, transaction) => {
			if (transaction.destination_account_id === accountId) {
				return sum + transaction.amount;
			}
			if (transaction.origin_account_id === accountId) {
				return sum - transaction.amount;
			}
			return sum;
		}, 0);

		const formattedAmount = totalAmount !== 0 ? `${totalAmount > 0 ? '+' : ''}${formatCurrency(totalAmount)}` : '0';

		return (
			<View className="flex-row items-center justify-between px-5 py-6 backdrop-blur-xl">
				<Text className="font-bold text-card-foreground text-xl">{section.title}</Text>
				<Text className="font-bold text-muted-foreground text-xl">{formattedAmount}</Text>
			</View>
		);
	};

	if (!transactions) {
		return (
			<SafeAreaView className="flex-1">
				<View className="flex-1 items-center justify-center">
					<ActivityIndicator size="large" />
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SectionList
			sections={transactions}
			keyExtractor={(item) => item.id}
			refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
			renderItem={renderTransaction}
			renderSectionHeader={renderSectionHeader}
		/>
	);
}
