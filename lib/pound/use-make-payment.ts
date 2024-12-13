import { useMutation } from '@tanstack/react-query';

import { makePayment } from '~/api/deposit/payment';
import { MakePaymentProps } from '~/api/deposit/payment.types';

export function useMakePayment() {
	return useMutation({
		mutationFn: (paymentData: MakePaymentProps) => makePayment(paymentData),
	});
}
