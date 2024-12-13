import { poundApi } from '~/api/common/pound-api.config';

import { MakePaymentProps } from './payment.types';

const ENDPOINT = '/deposit/payment';

export const makePayment = async (paymentData: MakePaymentProps, options?: { signal?: AbortSignal }) => {
	try {
		const { data } = await poundApi.post<{ nextStepUrl?: string }>(ENDPOINT, paymentData, options);
		return data;
	} catch (error) {
		console.log(error);
		throw error;
	}
};
