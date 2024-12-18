import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createCard } from '~/api/deposit/card';
import { CreateCardProps } from '~/api/deposit/card.types';

import { queries } from './queries';

export function useCreateCard() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (cardData: CreateCardProps) => createCard(cardData),
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: queries.cards.list.queryKey });
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: queries.cards.list.queryKey });
		},
	});
}
