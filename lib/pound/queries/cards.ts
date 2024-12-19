import { createQueryKeys } from '@lukemorales/query-key-factory';

import { listCards } from '~/api/deposit/card';

export const cards = createQueryKeys('cards', {
	list: {
		queryKey: null,
		queryFn: ({ signal }) => listCards({ signal }),
	},
});
