import { useQuery } from '@tanstack/react-query';

import { listCards } from '~/api/deposit/card';

const QUERY_KEY = 'card';

export function getQueryKey(page?: number) {
	if (page === undefined) {
		return [QUERY_KEY];
	}
	return [QUERY_KEY, page];
}

export function useListCards() {
	return useQuery({
		queryKey: getQueryKey(),
		queryFn: ({ signal }) => listCards({ signal }),
	});
}
