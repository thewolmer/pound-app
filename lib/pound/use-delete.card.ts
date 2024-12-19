import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteCard } from '~/api/deposit/card';

import { queries } from './queries';

export const useDeleteCard = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (tokenId: string) => deleteCard(tokenId),
		onMutate: async (tokenId: string) => {
			await queryClient.cancelQueries({ queryKey: queries.cards.list.queryKey });

			// Optionally, optimistically remove the card from cache
			const previousCards = queryClient.getQueryData(queries.cards.list.queryKey);
			if (previousCards) {
				queryClient.setQueryData(queries.cards.list.queryKey, (old: any) => {
					return old.filter((card: any) => card.token !== tokenId);
				});
			}

			return { previousCards };
		},
		onError: (err, tokenId, context: any) => {
			// Rollback the optimistic update on error
			queryClient.setQueryData(queries.cards.list.queryKey, context?.previousCards);
		},
		onSettled: () => {
			// Invalidate the query to fetch the latest cards
			queryClient.invalidateQueries({ queryKey: queries.cards.list.queryKey });
		},
	});
};
