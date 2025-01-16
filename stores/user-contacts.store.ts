import { observable } from '@legendapp/state';
import { syncObservable } from '@legendapp/state/sync';
import { Fields, getContactsAsync, requestPermissionsAsync } from 'expo-contacts';

import { getAccountDetails, listAccountDetails } from '~/api/account-details';
import { createContacts, deleteContact as deleteContactApi, listContacts } from '~/api/contacts';
import { persistOptions } from '~/config/legend-state';
import { Tables } from '~/types/database.types';

import { auth$ } from './auth.store';

interface UserContactsState {
	isLoading: boolean;
	contacts: Record<string, Tables<'account_details'>>;
}

export const userContacts$ = observable<UserContactsState>({
	isLoading: false,
	contacts: {},
});

syncObservable(
	userContacts$,
	persistOptions({
		persist: {
			name: 'user-contacts-store',
		},
	})
);

export const refreshContacts = async () => {
	userContacts$.isLoading.set(true);
	const contacts = await listContacts();
	userContacts$.contacts.set(
		contacts.reduce(
			(acc, contact) => {
				acc[contact.user_id as string] = contact;
				return acc;
			},
			{} as Record<string, Tables<'account_details'>>
		)
	);
	userContacts$.isLoading.set(false);
};

export const syncDeviceContacts = async () => {
	userContacts$.isLoading.set(true);
	const deviceContacts = await getDeviceContacts();
	const deviceContactEmails = deviceContacts.flatMap((contact) => contact.emails);
	const poundUsers = await listAccountDetails({ filterByEmails: deviceContactEmails });

	const existingContactsIds = new Set(Object.keys(userContacts$.contacts.get()));
	const phoneContactsIds = new Set(poundUsers.map((contact) => contact.user_id as string));

	const newContacts = [...phoneContactsIds].filter((id) => !existingContactsIds.has(id));
	if (newContacts.length > 0) {
		const userId$ = auth$.session.user.id.get();
		if (!userId$) {
			throw new Error('No user id');
		}
		await createContacts(newContacts.map((id) => ({ user_id: userId$, contact_id: id })));
		const contactsToAdd = poundUsers.filter((contact) => newContacts.includes(contact.user_id as string));
		contactsToAdd.forEach((contact) => {
			userContacts$.contacts[contact.user_id as string].set(contact);
		});
	}
	userContacts$.isLoading.set(false);
};

const getDeviceContacts = async () => {
	const { status } = await requestPermissionsAsync();
	if (status === 'granted') {
		const { data } = await getContactsAsync({
			fields: [Fields.Name, Fields.Image, Fields.PhoneNumbers, Fields.Emails],
		});
		return data.map((contact) => ({
			name: contact.name,
			phoneNumbers: (contact.phoneNumbers?.map((phone) => phone.number?.replace(/\s+/g, '')) || []).filter(
				Boolean
			) as string[],
			emails: (contact.emails?.map((email) => email.email?.toLowerCase()) || []).filter(Boolean) as string[],
		}));
	}
	return [];
};

export const addContact = async (contactId: string) => {
	const userId$ = auth$.session.user.id.get();
	if (!userId$) {
		throw new Error('No user id');
	}
	const doesExist = userContacts$.contacts.get()[contactId];
	if (doesExist) {
		return;
	}
	userContacts$.isLoading.set(true);
	try {
		await createContacts({ user_id: userId$, contact_id: contactId });
		const accountDetails = await getAccountDetails(contactId);
		userContacts$.contacts[contactId].set(accountDetails);
	} catch (error) {
		console.error(error);
	} finally {
		userContacts$.isLoading.set(false);
	}
};

export const deleteContact = async (contactId: string) => {
	userContacts$.isLoading.set(true);
	const contact$ = userContacts$.contacts[contactId].get();
	if (!contact$) {
		return;
	}
	const deviceContacts = await getDeviceContacts();
	const deviceContactEmails = deviceContacts.flatMap((contact) => contact.emails);
	if (deviceContactEmails.includes(contact$.email as string)) {
		throw new Error('Cannot delete contact that is in device contacts');
	}
	try {
		await deleteContactApi(contactId);
		userContacts$.contacts[contactId].delete();
	} catch (error) {
		console.error(error);
	} finally {
		userContacts$.isLoading.set(false);
	}
};
