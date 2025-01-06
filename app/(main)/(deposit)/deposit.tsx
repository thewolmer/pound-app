import React, { useCallback, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, useFocusEffect } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';
import { useAtomValue } from 'jotai/react';
import { Controller, useForm } from 'react-hook-form';
import {
	ActivityIndicator,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	ScrollView,
	Text,
	View,
} from 'react-native';
import { z } from 'zod';

import { Card as CardType } from '~/api/deposit/card.types';
import { Button } from '~/components/ui/button';
import { Card, CardFooter, CardHeader } from '~/components/ui/card';
import { HintBox } from '~/components/ui/hint-box';
import { Input } from '~/components/ui/input';
import { H3 } from '~/components/ui/typography';
import { Env } from '~/config/env';
import { defaultCardAtom } from '~/lib/atoms';
import { getCardIcon } from '~/lib/CardIcons';
import { parseCurrency } from '~/lib/formatCurrency';
import { useListCards } from '~/lib/pound/use-list-cards';
import { useMakePayment } from '~/lib/pound/use-make-payment';
import { cn } from '~/lib/utils';

const AmountSchema = z.object({
	amount: z.preprocess(
		(val) => Number.parseFloat(val as string),
		z.number().positive('Amount must be greater than 0').min(0.01, 'Amount must be at least 0.01')
	),
});

type AmountFormValues = z.infer<typeof AmountSchema>;

const predefinedAmounts = [0.01, 10, 25, 50, 100];

export default function Deposit() {
	const { data: cards, isLoading } = useListCards();
	const { mutate: makePayment, isPending } = useMakePayment();

	const cardSelectModal = useRef<BottomSheetModal>(null);

	const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
	const defaultCard = useAtomValue(defaultCardAtom);

	const renderBackDrop = useCallback(
		(backdropProps: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...backdropProps} />
		),
		[]
	);

	const {
		control,
		handleSubmit,
		setValue,
		formState: { errors, isSubmitting, isDirty },
	} = useForm<AmountFormValues>({
		resolver: zodResolver(AmountSchema),
		defaultValues: {
			amount: 0,
		},
	});

	const onSubmit = (data: AmountFormValues) => {
		if (!selectedCard) {
			alert('Please select a card.');
			return;
		}
		//maybe redirect should also go to the same success screen on successful 3ds?
		const redirectUrl = `${Env.EXPO_PUBLIC_POUND_WEB_URL}/app/home?env=${Env.APP_ENV}`;
		makePayment(
			{ amount: data.amount, token: selectedCard.token, redirectUrl },
			{
				onSuccess: async (data) => {
					if (data.nextStepUrl) {
						await openBrowserAsync(data.nextStepUrl, {
							showInRecents: true,
							createTask: false,
						});
					} else {
						//TODO: you can check for status PAID and do something here
						router.dismissAll();
					}
				},
				onError: (error) => {
					console.log(error);
				},
			}
		);
	};

	useFocusEffect(() => {
		setSelectedCard(null); // clear if coming from back btn
		if (!defaultCard && cards && cards.length > 0) {
			setSelectedCard(cards[0]);
		}
		if (defaultCard && cards && cards?.length > 0) {
			const matchedCard = cards.find((card) => card.token === defaultCard.token);
			if (matchedCard) {
				setSelectedCard(matchedCard);
			} else {
				setSelectedCard(null);
			}
		}
	});

	return (
		<SafeAreaView className="flex-1">
			<KeyboardAvoidingView
				keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				className="flex-1"
			>
				<ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 6 }}>
					<Card>
						<CardHeader>
							<Controller
								name="amount"
								control={control}
								render={({ field: { onChange, value } }) => (
									<View className="flex flex-row items-center justify-between gap-1">
										<Text className="w-[10%] text-2xl font-semibold text-muted-foreground">£</Text>
										<Input
											keyboardType="decimal-pad"
											className="w-[90%] text-2xl placeholder:font-extrabold placeholder:text-muted-foreground"
											value={isDirty ? value.toString() : ''}
											onChangeText={(text) => onChange(parseCurrency(text))}
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
									<Button
										variant={'outline'}
										size={'sm'}
										key={amount}
										onPress={() => setValue('amount', amount, { shouldDirty: true, shouldTouch: true })}
									>
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
						{selectedCard ? (
							<Button
								variant="outline"
								size={'lg'}
								haptics="impact-light"
								onPress={() => {
									Keyboard.dismiss();
									cardSelectModal.current?.present();
								}}
								className="flex flex-row items-center justify-start gap-4 border-primary px-4 py-2"
							>
								<Ionicons name="checkmark-circle" size={24} className={'text-primary'} />
								<View className="flex flex-row items-center justify-center gap-2">
									{getCardIcon(selectedCard.card.type)}
									<Text className={'text-base font-semibold text-foreground'}>
										Ending in {selectedCard.card.last_4_digits}
									</Text>
									<Ionicons name="chevron-up" size={14} className={'text-foreground'} />
								</View>
							</Button>
						) : (
							<Button
								variant="outline"
								size={'lg'}
								haptics="impact-light"
								onPress={() => {
									Keyboard.dismiss();
									cardSelectModal.current?.present();
								}}
								className={'flex flex-row items-center justify-start gap-2 px-4 py-2'}
							>
								<Ionicons name={'card-outline'} className="text-foreground" size={24} />
								<Text className={'text-base font-semibold text-foreground'}>Select a Card</Text>
								<Ionicons name="chevron-up" size={12} className={'text-foreground'} />
							</Button>
						)}
					</View>
					<Button disabled={isSubmitting || !selectedCard} onPress={handleSubmit(onSubmit)} className="bg-primary">
						{isSubmitting || isPending ? (
							<ActivityIndicator color={'white'} />
						) : (
							<Text className="text-primary-foreground">Next</Text>
						)}
					</Button>
				</View>
				{/* Card Select Modal */}
				<BottomSheetModal
					backdropComponent={renderBackDrop}
					ref={cardSelectModal}
					snapPoints={['80']}
					enableDismissOnClose
					handleIndicatorStyle={{ backgroundColor: '#fff' }}
					backgroundStyle={{ backgroundColor: 'transparent' }}
					onDismiss={() => {
						cardSelectModal.current?.close();
					}}
				>
					<BottomSheetView className={cn('flex-1 gap-5 rounded-t-2xl bg-card p-5 transition-all duration-700')}>
						<H3 className="text-card-foreground">Select A Card</H3>
						<View className="gap-2">
							{isLoading && <ActivityIndicator color={'white'} />}
							{cards?.map((card) => {
								const isSelectedCard = selectedCard?.token === card.token;
								return (
									<Button
										key={card.token}
										size={'lg'}
										disabled={!card.active}
										onPress={() => {
											setSelectedCard(card);
											cardSelectModal.current?.close();
										}}
										variant={'outline'}
										className={cn(
											'flex flex-row items-center justify-start gap-2 px-4 py-2',
											'text-primary-foreground',
											isSelectedCard && 'border-primary'
										)}
									>
										<Ionicons
											name={isSelectedCard ? 'radio-button-on' : 'radio-button-off'}
											size={24}
											className={cn(isSelectedCard ? 'text-primary' : 'text-foreground')}
										/>
										{getCardIcon(card.card.type)}
										<Text className={cn('text-base font-semibold text-foreground')}>
											Ending in {card.card.last_4_digits}
										</Text>
									</Button>
								);
							})}
							{cards?.length !== 0 && (
								<Button
									variant="outline"
									size={'lg'}
									onPress={() => {
										cardSelectModal.current?.close();
										router.push('/(main)/(deposit)/manage-cards');
									}}
									className={'flex flex-row items-center justify-start gap-2 px-4 py-2'}
								>
									<Ionicons name={'card-outline'} className="text-foreground" size={24} />
									<Text className={'text-base font-semibold text-foreground'}>Manage Cards</Text>
								</Button>
							)}
							<Button
								variant="outline"
								size={'lg'}
								onPress={() => {
									cardSelectModal.current?.close();
									router.push('/(main)/(deposit)/add-card');
								}}
								className={'flex flex-row items-center justify-start gap-2 px-4 py-2'}
							>
								<Ionicons name={'add-circle-outline'} className="text-foreground" size={24} />
								<Text className={'text-base font-semibold text-foreground'}>Add a new Card</Text>
							</Button>
							<HintBox
								className="my-2"
								text="You can enable a card to be auto selected by setting up your Primary Card in the Manage Cards screen."
								when={!defaultCard && cards?.length !== 0}
							/>
						</View>
					</BottomSheetView>
				</BottomSheetModal>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}
