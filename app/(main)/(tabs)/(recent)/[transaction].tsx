import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { use$ } from '@legendapp/state/react';
import { format } from 'date-fns';
import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Image, Text, View } from 'react-native';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { BodyView } from '~/components/ui/body-view';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '~/components/ui/card';
import { Modal } from '~/components/ui/modal';
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
	const addToContactModal = React.useRef<BottomSheetModal>(null);
	const removeFromContactModal = React.useRef<BottomSheetModal>(null);

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
				.eq('id', Array.isArray(id) ? id[0] : id)
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
	const otherUser = isDeposit ? transaction?.origin_account_details : transaction?.destination_account_details;

	const isInContacts = !!contacts.find((contact) => contact.user_id === otherUser?.user_id);

	const addToContact = () => {
		if (!isInContacts && typeof otherUser?.user_id === 'string' && !isLoadingContacts && !isCreatingContacts) {
			createContacts([otherUser.user_id]);
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
		<BodyView>
			<View className="gap-4 p-6">
				<Card>
					<CardHeader>
						<Text className="text-lg font-bold text-foreground">{isDeposit ? 'Received from ' : 'Sent to'}</Text>
					</CardHeader>
					<CardContent className="flex w-full flex-row items-center justify-between gap-4">
						<View className="flex w-[60%] flex-row items-center gap-4">
							<Avatar alt="User avatar" className="h-14 w-14">
								<AvatarImage source={{ uri: otherUser?.avatar_url ?? undefined }} />
								<AvatarFallback>
									<Ionicons name="person" size={24} className="text-foreground" />
								</AvatarFallback>
							</Avatar>
							<View>
								<Text className="line-clamp-2 items-center truncate font-bold text-foreground">
									{otherUser?.display_name ?? 'invalid-user'}
								</Text>
								{otherUser?.identity_tag && (
									<Text className="text-sm text-muted-foreground">@{otherUser.identity_tag ?? 'invalid-user'}</Text>
								)}
							</View>
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
								<Text className="font-semibold capitalize text-foreground">{transaction.status ?? 'invalid-tx'}</Text>
							</Text>
						</View>
						<View className="gap-1">
							<Text className="text-sm text-muted-foreground">Transaction Time</Text>
							<Text>
								<Text className="font-semibold text-foreground">
									{format(new Date(transaction.created_at), 'PP - pp')}
								</Text>
							</Text>
						</View>
						<View className="gap-1">
							<Text className="text-sm text-muted-foreground">Transaction ID</Text>
							<Text>
								<Text className="font-semibold text-foreground">{transaction.id ?? 'invalid-tx'}</Text>
							</Text>
						</View>
						<View className="gap-1">
							<Text className="text-sm text-muted-foreground">Reference</Text>
							<Text>
								<Text className="font-semibold text-foreground">{transaction.reference ?? 'invalid-tx'}</Text>
							</Text>
						</View>
					</View>
				</Card>
				<Card>
					<CardHeader className="flex w-full flex-row items-center justify-between">
						<View className="flex w-[1/4] items-center justify-center gap-1">
							<Button
								size={'icon'}
								variant={'secondary'}
								onPress={
									isInContacts
										? () => removeFromContactModal.current?.present()
										: () => addToContactModal.current?.present()
								}
							>
								<Ionicons
									name={isInContacts ? 'person-remove-outline' : 'person-add-outline'}
									size={18}
									className="text-secondary-foreground"
								/>
							</Button>
							<Text className="w-14 text-balance text-center text-[9px] text-muted-foreground">
								{isInContacts ? 'Remove Contact' : 'Add Contact'}
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
			<Modal
				ref={addToContactModal}
				title={otherUser?.display_name || 'User'}
				description={'Add this user to your contacts?'}
				type="confirm"
				options={{
					primaryAction: addToContact,
					primaryBtnText: 'Add to Contacts',
				}}
			/>
			<Modal
				ref={removeFromContactModal}
				title={otherUser?.display_name || 'User'}
				description={'Remove this user from your contacts?'}
				type="destructive"
				options={{
					primaryBtnText: 'Remove',
				}}
			/>
		</BodyView>
	);
}

export default Transaction;
