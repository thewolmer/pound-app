import { createQueryKeys } from '@lukemorales/query-key-factory';

import { listAccountDetails } from '~/api/account-details';
import { AccountDetailsFilters } from '~/api/account-details/account-details.types';

export const accountDetails = createQueryKeys('accountDetails', {
	list: (filters: AccountDetailsFilters) => ({
		queryKey: [{ filters }],
		queryFn: ({ signal }) => listAccountDetails(filters, { signal }),
	}),
});
