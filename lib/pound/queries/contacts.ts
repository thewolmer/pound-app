import { createQueryKeys } from '@lukemorales/query-key-factory';

import { listContacts } from '~/api/contacts';

export const contacts = createQueryKeys('contacts', {
	list: {
		queryKey: null,
		queryFn: ({ signal }) => listContacts({ signal }),
	},
});
