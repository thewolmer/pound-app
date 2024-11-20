import { Ionicons } from '@expo/vector-icons';
import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetTextInput,
	BottomSheetView,
} from '@gorhom/bottom-sheet';
import type { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import * as Contacts from 'expo-contacts';
import { router } from 'expo-router';
import type React from 'react';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Platform, Pressable } from 'react-native';
import { Image, Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { ForwardCard } from '~/components/ui/ForwardCard';
import { Button } from '~/components/ui/button';
import { H3 } from '~/components/ui/typography';
import { supabase } from '~/lib/supabase';
import { cn } from '~/lib/utils';
import type { Tables } from '~/types/database.types';
import { Input } from '../ui/input';

interface ContactWithAccountDetails extends Contacts.Contact {
	isPoundUser: boolean;
	account_details?: Tables<'account_details'>;
}

export const SendViaContact = () => {
	const contactsModalRef = useRef<BottomSheetModal>(null);
	const [contacts, setContacts] = useState<ContactWithAccountDetails[]>([]);
	const [search, setSearch] = useState('');

	const renderBackDrop = useCallback(
		(backdropProps: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...backdropProps} />
		),
		[],
	);

	const fetchContacts = async () => {
		const { status } = await Contacts.requestPermissionsAsync();
		if (status === 'granted') {
			const { data: contactData } = await Contacts.getContactsAsync({
				fields: [Contacts.Fields.Name, Contacts.Fields.Image, Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
			});

			// Extract emails from contacts
			const emails = contactData
				.flatMap((contact) => contact.emails?.map((email) => email.email) || [])
				.filter((email): email is string => !!email); // Filter out any undefined emails

			// Query account details for these emails
			const { data: accountDetails, error } = await supabase.from('account_details').select('*').in('email', emails);

			if (error) {
				console.error('Error fetching account details:', error.message);
				return;
			}

			// Create a map for quick lookup of account details by email
			const accountDetailsMap = new Map();
			for (const detail of accountDetails || []) {
				if (detail.email) accountDetailsMap.set(detail.email, detail);
			}

			// Update contacts with account details
			const updatedContacts = contactData.map((contact) => {
				const contactEmail = contact.emails?.[0]?.email;
				const accountInfo = contactEmail ? accountDetailsMap.get(contactEmail) : undefined;

				return {
					...contact,
					isPoundUser: !!accountInfo,
					account_details: accountInfo,
				};
			});

			setContacts(updatedContacts);
		}
	};

	const openContactsModal = async () => {
		contactsModalRef.current?.present();
		await fetchContacts();
	};

	if (!contacts) {
		return (
			<View className="flex-1 items-center justify-center">
				<ActivityIndicator size="large" />
			</View>
		);
	}

	const filteredContacts = contacts.filter((contact) => contact.name?.toLowerCase().includes(search.toLowerCase()));
	return (
		<>
			<ForwardCard
				ionicons="people"
				title="Send from contacts"
				description="Send money to someone in your contacts"
				onPress={openContactsModal}
			/>
			<BottomSheetModal
				// enableContentPanningGesture={false}
				backdropComponent={renderBackDrop}
				ref={contactsModalRef}
				snapPoints={['85%']}
				enableDismissOnClose
				handleIndicatorStyle={{ backgroundColor: '#fff' }}
				backgroundStyle={{ backgroundColor: 'transparent' }}
				onDismiss={() => {
					setSearch('');
				}}
			>
				<BottomSheetView className="h-full flex-1 gap-5 rounded-t-2xl bg-card p-5">
					<View className="flex flex-row items-center justify-between">
						<H3>Select a contact</H3>
						<Button variant={'link'} onPress={() => contactsModalRef.current?.close()}>
							<Ionicons name="close" size={24} className="text-foreground" />
						</Button>
					</View>

					{Platform.OS === 'ios' ? (
						<BottomSheetTextInput
							placeholder="Search by name"
							value={search}
							onChangeText={setSearch}
							className="rounded-xl border border-border bg-muted p-2 text-foreground "
						/>
					) : (
						<Input placeholder="Search by names" value={search} onChangeText={setSearch} />
					)}
					<FlatList
						data={filteredContacts}
						keyExtractor={(item) => item.id || ''}
						renderItem={(props) => renderContactItem({ ...props, ref: contactsModalRef })}
					/>
				</BottomSheetView>
			</BottomSheetModal>
		</>
	);
};

const renderContactItem = ({
	item,
	ref,
}: { item: ContactWithAccountDetails; ref: React.RefObject<BottomSheetModalMethods> }) => (
	<Pressable
		disabled={!item.isPoundUser}
		onPress={() => {
			ref.current?.close();
			router.push({
				pathname: '/(main)/(send)/amount',
				params: { account_details: JSON.stringify(item.account_details) },
			});
		}}
		className={cn(
			'flex-row items-center justify-start border-border border-b p-2',
			item.isPoundUser ? 'opacity-100' : 'opacity-60',
		)}
	>
		{item.imageAvailable && item.image ? (
			<Image source={{ uri: item.image.uri }} className="h-10 w-10 rounded-full" />
		) : (
			<View className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
				<Text className="text-center text-2xl text-foreground">{item.name?.[0]}</Text>
			</View>
		)}
		<View className="ml-3">
			<Text className="font-semibold text-foreground">{item.name}</Text>
			{item.isPoundUser &&
				(item.account_details?.identity_tag ? (
					<Text className="text-muted-foreground text-xs">@{item.account_details?.identity_tag}</Text>
				) : (
					<Text className="text-muted-foreground text-xs">{item.account_details?.email}</Text>
				))}
			{!item.isPoundUser &&
				(item.emails?.length ? (
					<Text className="text-muted-foreground text-xs">{item.emails[0].email}</Text>
				) : (
					<Text className="text-muted-foreground text-xs">{item.phoneNumbers?.[0].number}</Text>
				))}
		</View>
	</Pressable>
);
