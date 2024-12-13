import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { z } from 'zod';

import { Button } from '~/components/ui/button';
import { Card, CardFooter, CardHeader } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Env } from '~/config/env';
import { getCardIcon } from '~/lib/CardIcons';
import { useListCards } from '~/lib/pound/use-list-cards';
import { useMakePayment } from '~/lib/pound/use-make-payment';
import { cn, uuid } from '~/lib/utils';

const AmountSchema = z.object({
	amount: z.preprocess(
		(val) => Number.parseFloat(val as string),
		z.number().positive('Amount must be greater than 0').min(0.01, 'Amount must be at least 0.01')
	),
});

type AmountFormValues = z.infer<typeof AmountSchema>;

const predefinedAmounts = [0.01, 10, 25, 50, 100];

export default function Deposit() {
	const { data: cards } = useListCards();
	const { mutate: makePayment } = useMakePayment();

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
		//maybe redirect should also go to the same success screen on successful 3ds?
		const redirectUrl = `${Env.EXPO_PUBLIC_POUND_WEB_URL}/app/home?env=${Env.APP_ENV}`;
		makePayment(
			{ amount: data.amount, token: selectedCard, reference: uuid(), redirectUrl },
			{
				onSuccess: async (data) => {
					if (data.nextStepUrl) {
						await openBrowserAsync(data.nextStepUrl, {
							showInRecents: true,
							createTask: false,
						});
					} else {
						//TODO: show deposit success screen and redirect (button) to home?
					}
				},
				onError: (error) => {
					console.log(error);
				},
			}
		);
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
							onPress={() => router.push('/(main)/(deposit)/add-card')}
							className={'flex flex-row items-center justify-start gap-2 px-4 py-2'}
						>
							<Ionicons name={'add-circle-outline'} size={24} />
							<Text className={'text-base font-semibold'}>Add new card</Text>
						</Button>
						{cards?.map((card) => {
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
