import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createContacts } from '~/api/contacts';
import { useSession } from '~/context/SessionContext';
import { queries } from '~/lib/pound/queries';

export const useCreateContacts = () => {
	const queryClient = useQueryClient();
	const { session } = useSession();
	return useMutation({
		mutationFn: (contactIds: string[]) => {
			if (!session?.user.id) {
				throw new Error('No session!');
			}
			return createContacts(contactIds.map((id) => ({ user_id: session.user.id, contact_id: id })));
		},
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: queries.contacts.list.queryKey });
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: queries.contacts.list.queryKey });
		},
	});
};
