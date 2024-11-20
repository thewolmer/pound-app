import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, CardContent, CardFooter, CardHeader } from '~/components/ui/card';
import { useAccount } from '~/context/AccountContext';
import { formatCurrency } from '~/lib/formatCurrency';
import { supabase } from '~/lib/supabase';
import type { Tables } from '~/types/database.types';

interface TransactionWithAccounts extends Tables<'transaction'> {
	destination_account_details: Tables<'account_details'> | null;
	origin_account_details: Tables<'account_details'> | null;
}

function Transaction() {
	const { transaction: id } = useLocalSearchParams();
	const { accountId } = useAccount();

	const [transaction, setTransaction] = useState<TransactionWithAccounts | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			const { data, error } = await supabase
				.from('transaction')
				.select(
					`
          *,
          destination_account:account_details!transaction_destination_account_id_fkey (*),
          origin_account:account_details!transaction_origin_account_id_fkey (*)
        `,
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

	const isDeposit = transaction?.destination_account_id === accountId;

	if (!id || !transaction || !accountId) {
		return (
			<View className="flex-1 items-center justify-center">
				<ActivityIndicator size={'large'} />
			</View>
		);
	}

	return (
		<SafeAreaView className="flex-1">
			<View className="p-6">
				<Card>
					<CardHeader>
						<Text className="font-bold text-foreground text-lg">{isDeposit ? 'Received from ' : 'Sent to'}</Text>
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
										<Text className="font-black text-accent-foreground text-lg">
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
										<Text className="font-black text-accent-foreground text-lg">
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
										<Text className="text-muted-foreground text-sm">
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
										<Text className="text-muted-foreground text-sm">
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
							<Text className="font-semibold text-muted-foreground text-sm">Message : {transaction.message} </Text>
						</CardFooter>
					)}

					<View className="w-full gap-2 border-border border-t-2 p-4">
						<View className="flex flex-row items-center gap-2 py-3">
							<Ionicons name="reader-outline" size={18} className="text-muted-foreground" />
							<Text className="text-muted-foreground text-sm">Details</Text>
						</View>
						<View className="gap-1">
							<Text className="text-muted-foreground text-sm">Status</Text>
							<Text>
								{transaction?.status && (
									<Text className="font-semibold text-foreground capitalize">{transaction.status}</Text>
								)}
							</Text>
						</View>
						<View className="gap-1">
							<Text className="text-muted-foreground text-sm">Transaction Time</Text>
							<Text>
								{transaction?.created_at && (
									<Text className="font-semibold text-foreground">
										{format(new Date(transaction.created_at), 'PP - pp')}
									</Text>
								)}
							</Text>
						</View>
						<View className="gap-1">
							<Text className="text-muted-foreground text-sm">Transaction ID</Text>
							<Text>{transaction?.id && <Text className="font-semibold text-foreground">{transaction.id}</Text>}</Text>
						</View>
						<View className="gap-1">
							<Text className="text-muted-foreground text-sm">Reference</Text>
							<Text>
								{transaction?.reference && (
									<Text className="font-semibold text-foreground">{transaction.reference}</Text>
								)}
							</Text>
						</View>
					</View>
				</Card>
			</View>
		</SafeAreaView>
	);
}

export default Transaction;
