import { supabase } from '~/lib/supabase';

import { AccountDetailsFilters } from './account-details.types';

export const listAccountDetails = async (props: AccountDetailsFilters, options?: { signal?: AbortSignal }) => {
	const query = supabase.from('account_details').select();

	if (props.filterByEmails) {
		query.in('email', props.filterByEmails);
	}

	if (options?.signal) {
		query.abortSignal(options.signal);
	}

	const { data, error } = await query;

	if (error) {
		throw error;
	}

	return data;
};

export const getAccountDetails = async (user_id: string) => {
	const { data, error } = await supabase.from('account_details').select().eq('user_id', user_id).single();
	if (error) {
		throw error;
	}
	return data;
};
