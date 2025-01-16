import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { use$ } from '@legendapp/state/react';
import { format } from 'date-fns';
import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '~/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '~/components/ui/card';
import { formatCurrency } from '~/lib/formatCurrency';
import { useCreateContacts } from '~/lib/pound/contacts/use-create-contacts';
import { useListContacts } from '~/lib/pound/contacts/use-list-contacts';
import { supabase } from '~/lib/supabase';
import { account$ } from '~/stores/account.store';
import type { Tables } from '~/types/database.types';

interface TransactionWithAccounts extends Tables<'transactions'> {
	destination_account_details: Tables<'account_details'> | null;
	origin_account_details: Tables<'account_details'> | null;
}

function Transaction() {
	const { transaction: id } = useLocalSearchParams();
	const accountId$ = use$(account$.accountId);

	const [transaction, setTransaction] = useState<TransactionWithAccounts | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			const { data, error } = await supabase
				.from('transactions')
				.select(
					`
          *,
          destination_account:account_details!transaction_destination_account_id_fkey (*),
          origin_account:account_details!transaction_origin_account_id_fkey (*)
        `
				)
				.eq('id', id)
				.single();

			if (data) {
				setTransaction({
					...data,
					destination_account_details: data.destination_account || null,
					origin_account_details: data.origin_account || null,
				});
			}
			if (error) {
				alert('Something went wrong');
				console.error(error);
			}
		};
		fetchData();
	}, [id]);

	const isDeposit = transaction?.destination_account_id === accountId$;

	const { data: contacts = [], isPending: isLoadingContacts } = useListContacts();
	const { mutate: createContacts, isPending: isCreatingContacts } = useCreateContacts();
	const otherUser = isDeposit
		? transaction?.origin_account_details?.user_id
		: transaction?.destination_account_details?.user_id;

	const isInContacts = !!contacts.find((contact) => contact.user_id === otherUser);

	const addToContact = () => {
		if (!isInContacts && typeof otherUser === 'string' && !isLoadingContacts && !isCreatingContacts) {
			createContacts([otherUser]);
		}
	};

	if (!id || !transaction || !accountId$) {
		return (
			<View className="flex-1 items-center justify-center">
				<ActivityIndicator size={'large'} />
			</View>
		);
	}

	return (
		<SafeAreaView className="flex-1">
			<View className="gap-4 p-6">
				<Card>
					<CardHeader>
						<Text className="text-lg font-bold text-foreground">{isDeposit ? 'Received from ' : 'Sent to'}</Text>
					</CardHeader>
					<CardContent className="flex w-full flex-row justify-between gap-4">
						<View className="flex w-[60%] flex-row items-center gap-4">
							{isDeposit ? (
								<View className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
									{transaction?.origin_account_details?.avatar_url ? (
										<Image
											source={{ uri: transaction?.origin_account_details?.avatar_url || undefined }}
											style={{ width: 48, height: 48, borderRadius: 28 }}
											resizeMode="cover"
										/>
									) : (
										<Text className="text-lg font-black text-accent-foreground">
											{transaction?.origin_account_details?.display_name?.[0]}
										</Text>
									)}
								</View>
							) : (
								<View className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
									{transaction?.destination_account_details?.avatar_url ? (
										<Image
											source={{ uri: transaction?.destination_account_details?.avatar_url || undefined }}
											style={{ width: 48, height: 48, borderRadius: 28 }}
											resizeMode="cover"
										/>
									) : (
										<Text className="text-lg font-black text-accent-foreground">
											{transaction?.destination_account_details?.display_name?.[0]}
										</Text>
									)}
								</View>
							)}
							{isDeposit ? (
								<View>
									<Text className="line-clamp-2 items-center truncate font-bold text-foreground">
										{transaction?.origin_account_details?.display_name}
									</Text>
									{transaction?.destination_account_details?.identity_tag && (
										<Text className="text-sm text-muted-foreground">
											@{transaction?.origin_account_details?.identity_tag}
										</Text>
									)}
								</View>
							) : (
								<View>
									<Text className="line-clamp-2 items-center truncate font-bold text-foreground">
										{transaction?.destination_account_details?.display_name}
									</Text>
									{transaction?.destination_account_details?.identity_tag && (
										<Text className="text-sm text-muted-foreground">
											@{transaction?.destination_account_details?.identity_tag}
										</Text>
									)}
								</View>
							)}
						</View>
						<View>
							<Text className="font-bold text-foreground">{formatCurrency(transaction?.amount as number)}</Text>
						</View>
					</CardContent>

					{transaction.message && (
						<CardFooter className="flex flex-col items-start justify-start">
							<Text className="text-sm font-semibold text-muted-foreground">Message : {transaction.message} </Text>
						</CardFooter>
					)}

					<View className="w-full gap-2 border-t-2 border-border p-4">
						<View className="flex flex-row items-center gap-2 py-3">
							<Ionicons name="reader-outline" size={18} className="text-muted-foreground" />
							<Text className="text-sm text-muted-foreground">Details</Text>
						</View>
						<View className="gap-1">
							<Text className="text-sm text-muted-foreground">Status</Text>
							<Text>
								{transaction?.status && (
									<Text className="font-semibold capitalize text-foreground">{transaction.status}</Text>
								)}
							</Text>
						</View>
						<View className="gap-1">
							<Text className="text-sm text-muted-foreground">Transaction Time</Text>
							<Text>
								{transaction?.created_at && (
									<Text className="font-semibold text-foreground">
										{format(new Date(transaction.created_at), 'PP - pp')}
									</Text>
								)}
							</Text>
						</View>
						<View className="gap-1">
							<Text className="text-sm text-muted-foreground">Transaction ID</Text>
							<Text>{transaction?.id && <Text className="font-semibold text-foreground">{transaction.id}</Text>}</Text>
						</View>
						<View className="gap-1">
							<Text className="text-sm text-muted-foreground">Reference</Text>
							<Text>
								{transaction?.reference && (
									<Text className="font-semibold text-foreground">{transaction.reference}</Text>
								)}
							</Text>
						</View>
					</View>
				</Card>
				<Card>
					<CardHeader className="flex w-full flex-row items-center justify-between">
						<View className="flex w-[1/4] items-center justify-center gap-1">
							<Button size={'icon'} variant={'secondary'} disabled={isInContacts} onPress={addToContact}>
								<Ionicons
									name={isInContacts ? 'person-add' : 'person-add-outline'}
									size={18}
									className="text-secondary-foreground"
								/>
							</Button>
							<Text className="w-14 text-balance text-center text-[9px] text-muted-foreground">
								{isInContacts ? 'Contact Saved' : 'Add Contact'}
							</Text>
						</View>
						<View className="flex w-[1/4] items-center justify-center gap-1">
							<Button
								size={'icon'}
								variant={'secondary'}
								onPress={() => {
									router.push({
										pathname: '/(main)/(send)/amount',
										params: {
											account_details: JSON.stringify(
												isDeposit ? transaction.origin_account_details : transaction.destination_account_details
											),
										},
									});
								}}
							>
								<Ionicons name={'arrow-up'} size={18} className="text-secondary-foreground" />
							</Button>
							<Text className="w-14 text-balance text-center text-[9px] text-muted-foreground">Send Money</Text>
						</View>
						<View className="flex w-[1/4] items-center justify-center gap-1">
							<Button
								size={'icon'}
								variant={'secondary'}
								onPress={() => {
									console.log('report clicked');
								}}
							>
								<Ionicons name={'flag'} size={18} className="text-secondary-foreground" />
							</Button>
							<Text className="w-16 text-center text-[9px] text-muted-foreground">Report Transaction</Text>
						</View>
						<View className="flex w-[1/4] items-center justify-center gap-1">
							<Button
								size={'icon'}
								variant={'secondary'}
								onPress={() => {
									console.log('Help clicked');
								}}
							>
								<Ionicons name={'help-outline'} size={18} className="text-secondary-foreground" />
							</Button>
							<Text className="w-14 text-balance text-center text-[9px] text-muted-foreground">Do something</Text>
						</View>
					</CardHeader>
				</Card>
			</View>
		</SafeAreaView>
	);
}

export default Transaction;
