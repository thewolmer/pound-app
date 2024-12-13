import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createCard } from '~/api/deposit/card';
import { CreateCardProps } from '~/api/deposit/card.types';

import { getQueryKey } from './use-list-cards';

export function useCreateCard() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (cardData: CreateCardProps) => createCard(cardData),
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: getQueryKey() });
		},
		onSuccess: async (data) => {
			await queryClient.invalidateQueries({ queryKey: getQueryKey() });
		},
	});
}
