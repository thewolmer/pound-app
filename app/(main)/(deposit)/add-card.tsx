import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import creditCardType from 'credit-card-type';
import { CreditCardType } from 'credit-card-type/dist/types';
import { endOfMonth, isBefore } from 'date-fns';
import { router } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Text, View } from 'react-native';
import { z } from 'zod';

import { BodyView } from '~/components/ui/body-view';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Env } from '~/config/env';
import { getCardIcon } from '~/lib/CardIcons';
import { useCreateCard } from '~/lib/pound/use-create-card';
import { uuid } from '~/lib/utils';

type AddCardFormValues = {
	cardNumber: string;
	expiryDate: string;
	cvv: string;
	cardHolderName: string;
};

export default function AddCard() {
	const [cardType, setCardType] = useState<CreditCardType | null>(null);
	const { mutate: createCard, isPending } = useCreateCard();

	const AddCardSchema = z.object({
		cardNumber: z
			.string()
			.refine((value) => cardType?.lengths.includes(value.replace(/\s+/g, '').length), 'Invalid card number.'),
		expiryDate: z
			.string()
			.regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Invalid Expiry Date.')
			.refine((value) => {
				const [month, year] = value.split('/');
				const expiry = endOfMonth(new Date(Number(20 + year), Number(month) - 1));
				return !isBefore(expiry, new Date());
			}, 'Card has expired.'),
		cvv: z
			.string()
			.refine((value) => cardType?.code?.size === value.length, `CVV must be ${cardType?.code?.size || 3} digits.`),
		cardHolderName: z.string().min(2, 'Name must be at least 2 characters long.'),
	});

	const {
		control,
		handleSubmit,
		setValue,
		formState: { errors },
		watch,
	} = useForm<AddCardFormValues>({
		resolver: zodResolver(AddCardSchema),
		defaultValues: {
			cardNumber: '',
			expiryDate: '',
			cvv: '',
			cardHolderName: '',
		},
	});

	const cardNumber = watch('cardNumber');

	useEffect(() => {
		if (cardNumber) {
			const sanitizedNumber = cardNumber.replace(/\s+/g, '');
			const detectedCard = creditCardType(sanitizedNumber)[0];
			setCardType(detectedCard || null);
			// Format card number dynamically based on detected gaps
			const gaps = detectedCard?.gaps || [4, 8, 12];
			let formatted = '';
			let currentIndex = 0;

			gaps.forEach((gap) => {
				if (sanitizedNumber.length > gap) {
					formatted += sanitizedNumber.slice(currentIndex, gap) + ' ';
					currentIndex = gap;
				}
			});
			formatted += sanitizedNumber.slice(currentIndex);

			setValue('cardNumber', formatted.trim());
		} else {
			setCardType(null);
		}
	}, [cardNumber, setValue]);

	const expiryDate = watch('expiryDate');
	useEffect(() => {
		if (expiryDate) {
			const sanitizedExpiry = expiryDate.replace(/\D/g, '');
			let formatted = '';

			if (sanitizedExpiry.length > 2) {
				formatted = sanitizedExpiry.slice(0, 2) + '/' + sanitizedExpiry.slice(2, 6);
			} else {
				formatted = sanitizedExpiry;
			}

			setValue('expiryDate', formatted);
		}
	}, [expiryDate, setValue]);

	const onSubmit = (data: AddCardFormValues) => {
		//maybe redirect should also go to the same success screen on successful card adding after 3ds?
		const redirectUrl = `${Env.EXPO_PUBLIC_POUND_WEB_URL}/app/deposit?action=card-added&env=${Env.APP_ENV}`;
		const variables = {
			card: {
				cvv: data.cvv,
				expiry_month: data.expiryDate.split('/')[0],
				expiry_year: '20' + data.expiryDate.split('/')[1],
				last_4_digits: data.cardNumber.slice(-4),
				name: data.cardHolderName,
				number: data.cardNumber,
				type: cardType?.type.toUpperCase() || 'UNKNOWN',
			},
			reference: uuid(),
			redirectUrl,
		};

		createCard(variables, {
			onSuccess: async (data) => {
				if (data.nextStepUrl) {
					await openBrowserAsync(data.nextStepUrl, {
						showInRecents: true,
						createTask: false,
					});
				} else {
					router.navigate('/(main)/(deposit)/manage-cards');
				}
			},
			onError: (error) => {
				console.log(error);
			},
		});
	};

	return (
		<BodyView className="p-4">
			{/* Card Number */}
			<View className="mb-4">
				<Controller
					name="cardNumber"
					control={control}
					render={({ field: { onChange, value } }) => (
						<View className="relative">
							{cardType?.type ? (
								<View style={{ position: 'absolute', left: 12, top: 12, zIndex: 10 }} className="text-muted-foreground">
									{getCardIcon(cardType.type)}
								</View>
							) : (
								<Ionicons
									name={'card-outline'}
									size={24}
									className="text-muted-foreground"
									style={{ position: 'absolute', left: 12, top: 12, zIndex: 10 }}
								/>
							)}
							<Input
								keyboardType="numeric"
								placeholder="Card Number"
								textContentType="creditCardNumber"
								value={value}
								onChangeText={onChange}
								maxLength={19}
								className="border-border"
								style={{
									paddingLeft: 50,
									borderWidth: 1,
									borderRadius: 8,
									height: 48,
								}}
							/>
						</View>
					)}
				/>
				{errors.cardNumber && <Text className="mt-1 text-sm text-red-500">{errors.cardNumber.message}</Text>}
			</View>

			{/* Expiry Date */}
			<View className="mb-4">
				<Controller
					name="expiryDate"
					control={control}
					render={({ field: { onChange, value } }) => (
						<Input
							textContentType="creditCardExpiration"
							placeholder="MM/YY"
							value={value}
							keyboardType="numeric"
							onChangeText={onChange}
							maxLength={5}
						/>
					)}
				/>
				{errors.expiryDate && <Text className="mt-1 text-sm text-red-500">{errors.expiryDate.message}</Text>}
			</View>

			{/* CVV */}
			<View className="mb-4">
				<Controller
					name="cvv"
					control={control}
					render={({ field: { onChange, value } }) => (
						<Input
							keyboardType="numeric"
							placeholder={`CVV (${cardType?.code?.size || 3} digits)`}
							value={value}
							onChangeText={onChange}
							textContentType="creditCardSecurityCode"
							secureTextEntry
							maxLength={cardType?.code?.size || 3}
							className="rounded-md border p-3"
						/>
					)}
				/>
				{errors.cvv && <Text className="mt-1 text-sm text-red-500">{errors.cvv.message}</Text>}
			</View>

			{/* Cardholder Name */}
			<View className="mb-4">
				<Controller
					name="cardHolderName"
					control={control}
					render={({ field: { onChange, value } }) => (
						<Input
							placeholder="Cardholder Name"
							value={value}
							textContentType="name"
							onChangeText={onChange}
							className="rounded-md border p-3"
						/>
					)}
				/>
				{errors.cardHolderName && <Text className="mt-1 text-sm text-red-500">{errors.cardHolderName.message}</Text>}
			</View>

			{/* Submit Button */}
			<Button disabled={isPending} onPress={handleSubmit(onSubmit)}>
				{isPending ? <ActivityIndicator color={'white'} /> : <Text className="text-primary-foreground">Add Card</Text>}
			</Button>
		</BodyView>
	);
}
