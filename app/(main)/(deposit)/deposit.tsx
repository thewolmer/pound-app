import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { z } from 'zod';

import { Button } from '~/components/ui/button';
import { Card, CardFooter, CardHeader } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { getCardIcon } from '~/lib/CardIcons';
import { cn } from '~/lib/utils';

const AmountSchema = z.object({
	amount: z.preprocess(
		(val) => Number.parseFloat(val as string),
		z.number().positive('Amount must be greater than 0').min(0.01, 'Amount must be at least 0.01')
	),
});

type AmountFormValues = z.infer<typeof AmountSchema>;

const predefinedAmounts = [10, 50, 100, 200, 500];

const cards = [
	{
		active: true,
		card: {
			last_4_digits: '0001',
			type: 'VISA',
		},
		created_at: '2021-03-30T10:06:07.000+00:00',
		mandate: {
			merchant_code: 'MDASYTPD',
			status: 'active',
			type: 'recurrent',
		},
		token: 'bcfc8e5f-3b47-4cb9-854b-3b7a4cce7be3',
		type: 'card',
	},
	{
		active: true,
		card: {
			last_4_digits: '4206',
			type: 'american-express',
		},
		created_at: '2021-03-30T10:06:07.000+00:00',
		mandate: {
			merchant_code: 'MDASYTPD',
			status: 'active',
			type: 'recurrent',
		},
		token: 'bcfc8e5f-3b47-4cs9-854b-3b7asade7be3',
		type: 'card',
	},
];

export default function Deposit() {
	const {
		control,
		handleSubmit,
		setValue,
		getValues,
		formState: { errors, isSubmitting },
	} = useForm<AmountFormValues>({
		resolver: zodResolver(AmountSchema),
		defaultValues: {
			amount: 0,
		},
	});

	const [selectedCard, setSelectedCard] = useState<string | null>(null);

	const onSubmit = (data: AmountFormValues) => {
		if (!selectedCard) {
			alert('Please select a card.');
			return;
		}
		alert(`Amount: £${data.amount}, Selected Card ID: ${selectedCard}`);
	};

	return (
		<SafeAreaView className="flex-1">
			<KeyboardAvoidingView
				keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				className="flex-1"
			>
				<ScrollView contentContainerStyle={{ padding: 6 }}>
					<Card>
						<CardHeader>
							<Controller
								name="amount"
								control={control}
								render={({ field: { onChange, value } }) => (
									<View className="flex flex-row items-center justify-between gap-1">
										<Text className="w-[10%] text-2xl font-semibold text-muted-foreground">£</Text>
										<Input
											keyboardType="numeric"
											className="w-[90%] text-2xl placeholder:font-extrabold placeholder:text-muted-foreground"
											value={value > 0 ? value?.toString() : ''}
											onChangeText={(text) => onChange(Number(text))}
											autoFocus
											placeholder="Enter amount"
										/>
									</View>
								)}
							/>
							{errors.amount && <Text className="text-red-500">{errors.amount.message}</Text>}
						</CardHeader>
						<CardFooter>
							<View className="flex flex-row flex-wrap items-center gap-2">
								{predefinedAmounts.map((amount) => (
									<Button variant={'outline'} size={'sm'} key={amount} onPress={() => setValue('amount', amount)}>
										<Text className="font-semibold text-foreground">£{amount}</Text>
									</Button>
								))}
							</View>
						</CardFooter>
					</Card>
				</ScrollView>
				{/* Bottom Buttons */}
				<View className="gap-4 p-4">
					<View className="gap-2">
						<Button
							variant="outline"
							size={'lg'}
							onPress={() => router.push('/(main)/(deposit)/addcard')}
							className={'flex flex-row items-center justify-start gap-2 px-4 py-2'}
						>
							<Ionicons name={'add-circle-outline'} size={24} />
							<Text className={'text-base font-semibold'}>Add new card</Text>
						</Button>
						{cards.map((card) => {
							const isSelectedCard = selectedCard === card.token;
							return (
								<Button
									key={card.token}
									size={'lg'}
									disabled={!card.active}
									onPress={() => setSelectedCard(card.token)}
									variant={isSelectedCard ? 'default' : 'outline'}
									className={cn(
										'flex flex-row items-center justify-start gap-2 px-4 py-2',
										isSelectedCard ? 'text-secondary-foreground' : 'text-primary-foreground'
									)}
								>
									<Ionicons
										name={isSelectedCard ? 'radio-button-on' : 'radio-button-off'}
										size={24}
										className={cn(isSelectedCard ? 'text-primary-foreground' : 'text-foreground')}
									/>
									{getCardIcon(card.card.type)}
									<Text
										className={cn(
											'text-base font-semibold',
											isSelectedCard ? 'text-secondary-foreground' : 'text-foreground'
										)}
									>
										Ending in {card.card.last_4_digits}
									</Text>
								</Button>
							);
						})}
					</View>
					<Button
						disabled={isSubmitting || !selectedCard || getValues('amount') === 0}
						onPress={handleSubmit(onSubmit)}
						className="bg-primary"
					>
						<Text className="text-primary-foreground">{isSubmitting ? 'Submitting...' : 'Next'}</Text>
					</Button>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}
