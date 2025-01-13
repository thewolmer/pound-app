import { use$ } from '@legendapp/state/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createContacts } from '~/api/contacts';
import { queries } from '~/lib/pound/queries';
import { auth$ } from '~/stores/auth.store';

export const useCreateContacts = () => {
	const userId$ = use$(auth$.session.user.id);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (contactIds: string[]) => {
			if (!userId$) {
				throw new Error('No session!');
			}
			return createContacts(contactIds.map((id) => ({ user_id: userId$, contact_id: id })));
		},
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: queries.contacts.list.queryKey });
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: queries.contacts.list.queryKey });
		},
	});
};
