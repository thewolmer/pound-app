import { useCallback, useDeferredValue, useEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetView,
} from '@gorhom/bottom-sheet';
import type { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { Fields, getContactsAsync, requestPermissionsAsync } from 'expo-contacts';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Image, Platform, Pressable, Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { Input } from '../ui/input';
import { Button } from '~/components/ui/button';
import { ForwardCard } from '~/components/ui/forward-card';
import { H3 } from '~/components/ui/typography';
import { useListAccountDetails } from '~/lib/pound/account-details/use-list-account-details';
import { useCreateContacts } from '~/lib/pound/contacts/use-create-contacts';
import { useListContacts } from '~/lib/pound/contacts/use-list-contacts';
import type { Tables } from '~/types/database.types';

export const SendViaContact = () => {
	const [emails, setEmails] = useState<string[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);

	//TODO: @wol do something with loading states or remove them
	const { data: contacts, isPending: isLoadingContacts } = useListContacts({ enabled: isModalOpen });
	const { data: poundUsers, isPending: isLoadingPhoneContacts } = useListAccountDetails(
		{ filterByEmails: emails },
		{ enabled: emails.length > 0 }
	);
	const { mutate: createContacts, isPending: isCreatingContacts } = useCreateContacts();

	const contactsModalRef = useRef<BottomSheetModal>(null);

	const { control, watch } = useForm({
		defaultValues: {
			search: '',
		},
	});

	const search = watch('search');
	const deferredSearch = useDeferredValue(search);

	const renderBackDrop = useCallback(
		(backdropProps: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...backdropProps} />
		),
		[]
	);

	useEffect(() => {
		if (contacts && poundUsers) {
			const existingContactsIds = new Set(contacts.map((contact) => contact.user_id as string));
			const phoneContactsIds = new Set(poundUsers.map((contact) => contact.user_id as string));

			const newContacts = [...phoneContactsIds].filter((id) => !existingContactsIds.has(id));
			if (newContacts.length > 0) {
				createContacts(newContacts);
			}
		}
	}, [contacts, poundUsers, createContacts]);

	const getDeviceContacts = async () => {
		const { status } = await requestPermissionsAsync();
		if (status === 'granted') {
			const { data: contactData } = await getContactsAsync({
				fields: [Fields.Name, Fields.Image, Fields.PhoneNumbers, Fields.Emails],
			});

			const emails = contactData
				.flatMap((contact) => contact.emails?.map((email) => email.email?.toLowerCase()) || [])
				.filter((email): email is string => !!email);

			setEmails(emails);
		}
	};

	const openContactsModal = async () => {
		contactsModalRef.current?.present();
		await getDeviceContacts();
		setIsModalOpen(true);
	};

	const filteredContacts = contacts?.filter((contact) =>
		contact.display_name?.toLowerCase().includes(deferredSearch.toLowerCase())
	);

	return (
		<>
			<ForwardCard
				ionicons="people"
				title="Send from contacts"
				description="Send money to someone in your contacts"
				onPress={openContactsModal}
			/>
			<BottomSheetModal
				backdropComponent={renderBackDrop}
				ref={contactsModalRef}
				snapPoints={['85%']}
				enableDismissOnClose
				handleIndicatorStyle={{ backgroundColor: '#fff' }}
				backgroundStyle={{ backgroundColor: 'transparent' }}
				onDismiss={() => {}}
			>
				<BottomSheetView className="h-full flex-1 gap-5 rounded-t-2xl bg-card p-5">
					<View className="flex flex-row items-center justify-between">
						<H3>Select a contact</H3>
						<Button variant={'link'} onPress={() => contactsModalRef.current?.close()}>
							<Ionicons name="close" size={24} className="text-foreground" />
						</Button>
					</View>

					<Controller
						name="search"
						control={control}
						render={({ field: { onChange, value } }) =>
							Platform.OS === 'ios' ? (
								<Input
									placeholder="Search by name"
									value={value}
									onChangeText={onChange}
									className="rounded-xl border border-border bg-muted p-2 text-foreground"
								/>
							) : (
								<Input
									placeholder="Search by name"
									value={value}
									onChangeText={onChange}
									className="rounded-xl border border-border bg-muted p-2 text-foreground"
								/>
							)
						}
					/>

					<FlatList
						data={filteredContacts}
						keyExtractor={(item) => item.user_id || ''}
						renderItem={(props) => renderContactItem({ ...props, ref: contactsModalRef })}
						ListEmptyComponent={
							<View className="flex-1 items-center justify-center">
								<Text className="text-muted-foreground">No contact found.</Text>
							</View>
						}
					/>
				</BottomSheetView>
			</BottomSheetModal>
		</>
	);
};

const renderContactItem = ({
	item,
	ref,
}: {
	item: Tables<'account_details'>;
	ref: React.RefObject<BottomSheetModalMethods>;
}) => (
	<Pressable
		onPress={() => {
			ref.current?.close();
			router.push({
				pathname: '/(main)/(send)/amount',
				params: { account_details: JSON.stringify(item) },
			});
		}}
		className="flex-row items-center justify-start border-b border-border p-2"
	>
		{item.avatar_url ? (
			<Image source={{ uri: item.avatar_url }} className="h-10 w-10 rounded-2xl" />
		) : (
			<View className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent">
				<Text className="text-center text-2xl text-foreground">{item.display_name?.[0]}</Text>
			</View>
		)}
		<View className="ml-3">
			<Text className="font-semibold text-foreground">{item.display_name}</Text>
			{item.identity_tag ? (
				<Text className="text-xs text-muted-foreground">@{item.identity_tag}</Text>
			) : (
				<Text className="text-xs text-muted-foreground">{item.email}</Text>
			)}
		</View>
	</Pressable>
);
