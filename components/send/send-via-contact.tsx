import { useDeferredValue, useRef } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import type { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { use$ } from '@legendapp/state/react';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Image, Platform, Pressable, Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { Input } from '../ui/input';
import { Modal } from '../ui/modal';
import { ForwardCard } from '~/components/ui/forward-card';
import { refreshContacts, syncDeviceContacts, userContacts$ } from '~/stores/user-contacts.store';
import type { Tables } from '~/types/database.types';

export const SendViaContact = () => {
	const contacts$ = use$(userContacts$.contacts);

	const contactsModalRef = useRef<BottomSheetModal>(null);

	const { control, watch } = useForm({
		defaultValues: {
			search: '',
		},
	});

	const search = watch('search');
	const deferredSearch = useDeferredValue(search);

	const openContactsModal = async () => {
		contactsModalRef.current?.present();
		await refreshContacts();
		// TODO: maybe we should sync contacts on some kind of interval (1 day or something)
		await syncDeviceContacts();
	};

	const filteredContacts = Object.values(contacts$).filter((contact) =>
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
			<Modal ref={contactsModalRef} title="Select a Contact">
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
			</Modal>
		</>
	);
};

export const renderContactItem = ({
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
