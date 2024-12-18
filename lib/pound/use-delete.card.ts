import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteCard } from '~/api/deposit/card';

import { getQueryKey } from './use-list-cards';

export function useDeleteCard() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (tokenId: string) => deleteCard(tokenId),
		onMutate: async (tokenId: string) => {
			await queryClient.cancelQueries({ queryKey: getQueryKey() });

			// Optionally, optimistically remove the card from cache
			const previousCards = queryClient.getQueryData(getQueryKey());
			if (previousCards) {
				queryClient.setQueryData(getQueryKey(), (old: any) => {
					return old.filter((card: any) => card.token !== tokenId);
				});
			}

			return { previousCards };
		},
		onError: (err, tokenId, context: any) => {
			// Rollback the optimistic update on error
			queryClient.setQueryData(getQueryKey(), context?.previousCards);
		},
		onSettled: () => {
			// Invalidate the query to fetch the latest cards
			queryClient.invalidateQueries({ queryKey: getQueryKey() });
		},
	});
}
