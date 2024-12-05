import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import creditCardType from 'credit-card-type';
import { Controller, useForm } from 'react-hook-form';
import { Alert, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { z } from 'zod';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';

const AddCardSchema = z.object({
	cardNumber: z
		.string()
		.min(13, 'Card number must be at least 13 digits.')
		.max(19, 'Card number must not exceed 19 digits.')
		.regex(/^\d+$/, 'Card number must contain only numbers.'),
	expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry date must be in MM/YY format.'),
	cvv: z
		.string()
		.min(3, 'CVV must be at least 3 digits.')
		.max(4, 'CVV must not exceed 4 digits.')
		.regex(/^\d+$/, 'CVV must contain only numbers.'),
	cardHolderName: z.string().min(2, 'Name must be at least 2 characters long.'),
});

type AddCardFormValues = z.infer<typeof AddCardSchema>;

export default function AddCard() {
	const [cardType, setCardType] = useState<string | null>(null);

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
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
	React.useEffect(() => {
		if (cardNumber) {
			const detectedCard = creditCardType(cardNumber.replace(/\s+/g, ''))[0];
			setCardType(detectedCard?.type || null);
		} else {
			setCardType(null);
		}
	}, [cardNumber]);

	const onSubmit = (data: AddCardFormValues) => {
		Alert.alert('Card Added', JSON.stringify({ ...data, cardType }, null, 2));
	};

	return (
		<SafeAreaView className="flex-1">
			<ScrollView contentContainerStyle={{ padding: 16 }}>
				<Text className="mb-4 text-lg font-bold text-foreground">Add a New Card</Text>

				{/* Card Number */}
				<View className="mb-4">
					<Controller
						name="cardNumber"
						control={control}
						render={({ field: { onChange, value } }) => (
							<Input
								keyboardType="numeric"
								placeholder="Card Number"
								value={value}
								onChangeText={onChange}
								maxLength={19}
								className="rounded-md border p-3"
							/>
						)}
					/>
					{errors.cardNumber && <Text className="mt-1 text-sm text-red-500">{errors.cardNumber.message}</Text>}
					{cardType && (
						<Text className="mt-1 text-sm text-muted-foreground">Detected Type: {cardType.toUpperCase()}</Text>
					)}
				</View>

				{/* Expiry Date */}
				<View className="mb-4">
					<Controller
						name="expiryDate"
						control={control}
						render={({ field: { onChange, value } }) => (
							<Input
								keyboardType="numeric"
								placeholder="MM/YY"
								value={value}
								onChangeText={onChange}
								maxLength={5}
								className="rounded-md border p-3"
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
								placeholder="CVV"
								value={value}
								onChangeText={onChange}
								maxLength={4}
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
								onChangeText={onChange}
								className="rounded-md border p-3"
							/>
						)}
					/>
					{errors.cardHolderName && <Text className="mt-1 text-sm text-red-500">{errors.cardHolderName.message}</Text>}
				</View>

				{/* Submit Button */}
				<Button disabled={isSubmitting} onPress={handleSubmit(onSubmit)}>
					<Text className="text-primary-foreground">{isSubmitting ? 'Submitting...' : 'Add Card'}</Text>
				</Button>
			</ScrollView>
		</SafeAreaView>
	);
}
