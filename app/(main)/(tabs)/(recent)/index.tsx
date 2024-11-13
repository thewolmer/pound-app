import { useNavigation } from '@react-navigation/native';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import type React from 'react';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, SectionList, Text, View } from 'react-native';
import { TransactionItem } from '~/components/transactions/transaction-item';
import { useAccount } from '~/context/AccountContext';
import { formatCurrency } from '~/lib/formatCurrency';
import { supabase } from '~/lib/supabase';
import type { Tables } from '~/types/database.types';

interface TransactionSection {
	title: string;
	data: Tables<'account_transactions'>[];
}

export default function Recent() {
	const { accountId } = useAccount();
	const navigation = useNavigation();
	const [allTransactions, setAllTransactions] = useState<Tables<'account_transactions'>[]>([]);
	const [filteredTransactions, setFilteredTransactions] = useState<TransactionSection[]>([]);
	const [refreshing, setRefreshing] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');

	const fetchTransactions = async () => {
		if (!accountId) return;

		const { data, error } = await supabase
			.from('account_transactions')
			.select('*')
			.or(`origin_account_id.eq.${accountId},destination_account_id.eq.${accountId}`)
			.order('created_at', { ascending: false });

		if (error) {
			console.error(error);
			alert('Something went wrong');
			return;
		}

		setAllTransactions(data || []);
		setFilteredTransactions(groupTransactionsByDate(data || []));
	};

	const groupTransactionsByDate = (data: Tables<'account_transactions'>[]): TransactionSection[] => {
		return data.reduce<TransactionSection[]>((sections, transaction) => {
			const date = parseISO(transaction.created_at || '');
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

	// Update filtered data based on search query
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const filteredData = allTransactions.filter((transaction) => {
			const displayNameMatches = transaction.destination_display_name
				?.toLowerCase()
				.includes(searchQuery.toLowerCase());
			const amountMatches = transaction.amount?.toString().includes(searchQuery);

			return displayNameMatches || amountMatches;
		});

		setFilteredTransactions(groupTransactionsByDate(filteredData));
	}, [searchQuery, allTransactions]);

	// Update search bar in header
	useLayoutEffect(() => {
		navigation.setOptions({
			headerSearchBarOptions: {
				placeholder: 'Search transactions',
				onChangeText: (event: { nativeEvent: { text: React.SetStateAction<string> } }) =>
					setSearchQuery(event.nativeEvent.text),
			},
		});
	}, [navigation]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await fetchTransactions();
		setRefreshing(false);
	}, []);

	// Initial Fetch
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		fetchTransactions();
	}, [accountId]);

	const renderTransaction = ({ item }: { item: Tables<'account_transactions'> }) => (
		<View className="px-5">
			<TransactionItem item={item} onlyShowTime />
		</View>
	);

	const renderSectionHeader = ({ section }: { section: TransactionSection }) => {
		const totalAmount = section.data.reduce((sum, transaction) => {
			if (transaction.destination_account_id === accountId) {
				return sum + (transaction.amount || 0);
			}
			if (transaction.origin_account_id === accountId) {
				return sum - (transaction.amount || 0);
			}
			return sum;
		}, 0);

		const formattedAmount = totalAmount !== 0 ? `${totalAmount > 0 ? '+' : ''}${formatCurrency(totalAmount)}` : '0';

		return (
			<View className="flex-row items-center justify-between bg-card px-5 py-6">
				<Text className="font-bold text-card-foreground text-xl">{section.title}</Text>
				<Text className="font-bold text-muted-foreground text-xl">{formattedAmount}</Text>
			</View>
		);
	};

	if (!filteredTransactions) {
		return (
			<View className="flex flex-1 items-center justify-center">
				<ActivityIndicator size="large" />
			</View>
		);
	}

	return (
		<SectionList
			contentInsetAdjustmentBehavior="automatic"
			keyboardDismissMode="on-drag"
			sections={filteredTransactions}
			keyExtractor={(item) => item.id || Math.random().toString()}
			refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
			renderItem={renderTransaction}
			renderSectionHeader={renderSectionHeader}
		/>
	);
}
