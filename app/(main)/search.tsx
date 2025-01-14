import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Image, Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TransactionItem } from '~/components/transactions/transaction-item';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { useAccount } from '~/context/AccountContext';
import { useDebounce } from '~/hooks/useDebounce';
import { useListContacts } from '~/lib/pound/contacts/use-list-contacts';
import { supabase } from '~/lib/supabase';
import { Tables } from '~/types/database.types';

const Search = () => {
	const router = useRouter();
	const { accountId } = useAccount();
	const [poundTagUser, setPoundTagUser] = React.useState<Tables<'account_details'> | null>(null);
	const [contactUsers, setContactUsers] = React.useState<Tables<'account_details'>[] | null>(null);
	const [transactions, setTransactions] = React.useState<Tables<'account_transactions'>[] | null>(null);

	const { control, watch } = useForm({
		defaultValues: {
			searchQuery: '',
		},
	});

	const searchQuery = watch('searchQuery');

	const debouncedSearchQuery = useDebounce(searchQuery, 500);
	const { data: contacts = [], isPending: isLoadingContacts } = useListContacts();

	React.useEffect(() => {
		if (debouncedSearchQuery) {
			const cleanQuery = debouncedSearchQuery.startsWith('@') ? debouncedSearchQuery.slice(1) : debouncedSearchQuery;
			// poundtag search
			const getPoundUser = async () => {
				const { data, error } = await supabase
					.from('account_details')
					.select()
					.eq('identity_tag', cleanQuery.replace(' ', ''))
					.single();
				if (!error && data) {
					setPoundTagUser(data);
				} else {
					setPoundTagUser(null);
				}
				console.log(data, error);
			};
			// contact search
			const inContact = contacts.filter(
				(contact) =>
					contact.identity_tag === cleanQuery ||
					contact.display_name?.toLowerCase().includes(cleanQuery.toLowerCase()) ||
					contact.phone?.includes(cleanQuery) ||
					contact.email?.toLowerCase().includes(cleanQuery.toLowerCase())
			);
			if (inContact.length > 0) {
				setContactUsers(inContact);
			} else {
				setContactUsers(null);
			}
			// transaction search
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
				const filteredData = data.filter((transaction) => {
					const displayNameMatches = transaction.destination_display_name
						?.toLowerCase()
						.includes(cleanQuery.toLowerCase());
					const amountMatches = transaction.amount?.toString().includes(cleanQuery);
					return displayNameMatches || amountMatches;
				});
				setTransactions(filteredData || []);
			};
			getPoundUser();
			fetchTransactions();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearchQuery]);

	return (
		<>
			<SafeAreaView>
				<View className="mt-5 gap-5 px-5">
					<View className="mb-5 flex flex-row items-center justify-between">
						<Button variant={'link'} size={'icon'} className="mr-2" onPress={() => router.back()}>
							<Ionicons name="arrow-back" size={24} className="text-foreground" />
						</Button>
						<Controller
							name="searchQuery"
							control={control}
							render={({ field: { onChange, value } }) => (
								<Input
									value={value}
									className="flex-1"
									leftIcon="search"
									autoCapitalize="none"
									autoComplete="off"
									autoCorrect={false}
									autoFocus={true}
									onChangeText={onChange}
									placeholder="Search poundtag, user, business"
								/>
							)}
						/>
					</View>
					{!searchQuery && (
						<CategoryWrapper title="Recent">
							<View className="flex flex-row items-center justify-between">
								{Array.from({ length: 5 }).map((_, index) => (
									<View key={index} className="flex-row items-center p-2">
										<View className="flex-row items-center gap-4">
											<View className="relative h-12 w-12 animate-pulse rounded-2xl bg-muted p-2"></View>
										</View>
									</View>
								))}
							</View>
						</CategoryWrapper>
					)}
					{searchQuery && contactUsers && contactUsers?.length > 0 && (
						<CategoryWrapper title="In your contacts">
							{contactUsers.map((contact, index) => (
								<Pressable
									key={index}
									onPress={() => {
										router.push({
											pathname: '/(main)/(send)/amount',
											params: { account_details: JSON.stringify(contact) },
										});
									}}
									className="flex-row items-center justify-start border-b border-border p-2"
								>
									{contact.avatar_url ? (
										<Image source={{ uri: contact.avatar_url }} className="h-10 w-10 rounded-2xl" />
									) : (
										<View className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent">
											<Text className="text-center text-2xl text-foreground">{contact.display_name?.[0]}</Text>
										</View>
									)}
									<View className="ml-3">
										<Text className="font-semibold text-foreground">{contact.display_name}</Text>
										{contact.email && <Text className="text-xs text-muted-foreground">{contact.email}</Text>}
										{!contact.email && contact.identity_tag && (
											<Text className="text-xs text-muted-foreground">@{contact.identity_tag}</Text>
										)}
									</View>
								</Pressable>
							))}
						</CategoryWrapper>
					)}
					{searchQuery && poundTagUser && (
						<CategoryWrapper title="Pound Users">
							<Pressable
								onPress={() => {
									router.push({
										pathname: '/(main)/(send)/amount',
										params: { account_details: JSON.stringify(poundTagUser) },
									});
								}}
								className="flex-row items-center justify-start border-b border-border p-2"
							>
								{poundTagUser.avatar_url ? (
									<Image source={{ uri: poundTagUser.avatar_url }} className="h-10 w-10 rounded-2xl" />
								) : (
									<View className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent">
										<Text className="text-center text-2xl text-foreground">{poundTagUser.display_name?.[0]}</Text>
									</View>
								)}
								<View className="ml-3">
									<Text className="font-semibold text-foreground">{poundTagUser.display_name}</Text>
									<Text className="text-xs text-muted-foreground">@{poundTagUser.identity_tag}</Text>
								</View>
							</Pressable>
						</CategoryWrapper>
					)}
					{searchQuery && transactions && transactions.length > 0 && (
						<CategoryWrapper title="Transactions">
							{transactions.map((transaction, index) => (
								<TransactionItem key={index} item={transaction} />
							))}
						</CategoryWrapper>
					)}
				</View>
			</SafeAreaView>
		</>
	);
};

const CategoryWrapper = ({ children, title }: { children: React.ReactNode; title: string }) => {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center">
				<Text className="font-bold text-muted-foreground">{title}</Text>
			</CardHeader>
			<CardContent>{children}</CardContent>
		</Card>
	);
};
export default Search;
