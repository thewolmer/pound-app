import { poundApi } from '~/api/common/pound-api.config';

import { Card, CreateCardProps } from './card.types';

const ENDPOINT = '/deposit/card';

export const listCards = async (options?: { signal?: AbortSignal }) => {
	const { data } = await poundApi.get<Card[]>(ENDPOINT, options);
	return data;
};

export const createCard = async (cardData: CreateCardProps, options?: { signal?: AbortSignal }) => {
	try {
		const { data } = await poundApi.post<{ nextStepUrl?: string }>(ENDPOINT, cardData, options);
		return data;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

export const deleteCard = async (tokenId: string, options?: { signal?: AbortSignal }) => {
	const { data } = await poundApi.delete(`${ENDPOINT}/${tokenId}`, options);
	return data;
};
