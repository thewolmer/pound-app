import { supabase } from '~/lib/supabase';
import { Tables } from '~/types/database.types';

import { CreateContactProps } from './contacts.types';

export const listContacts = async (options?: { signal?: AbortSignal }) => {
	const query = supabase
		.from('user_contacts')
		.select('account_details!user_contacts_contact_id_fkey(*)')
		.order('account_details(display_name)', { ascending: true });

	if (options?.signal) {
		query.abortSignal(options.signal);
	}

	const { data, error } = await query;

	if (error) {
		throw error;
	}

	const contacts = data.map((contact) => ({
		...contact.account_details,
	})) as Tables<'account_details'>[];

	return contacts;
};

export const createContacts = async (
	data: CreateContactProps | CreateContactProps[],
	options?: { signal?: AbortSignal }
) => {
	const query = supabase.from('user_contacts').insert(Array.isArray(data) ? data : [data]);

	if (options?.signal) {
		query.abortSignal(options.signal);
	}

	const { error } = await query;

	if (error) {
		throw error;
	}
};

export const deleteContact = async (contact_id: string) => {
	const query = supabase.from('user_contacts').delete().eq('contact_id', contact_id);
	const { error } = await query;
	if (error) {
		throw error;
	}
};
