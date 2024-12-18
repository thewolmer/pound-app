import { useQuery } from '@tanstack/react-query';

import { queries } from './queries';

export function useListCards() {
	return useQuery(queries.cards.list);
}
