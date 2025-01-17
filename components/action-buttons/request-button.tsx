import React, { useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { use$ } from '@legendapp/state/react';
import { shareAsync } from 'expo-sharing';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, Text, View } from 'react-native';
import QRCodeStyled from 'react-native-qrcode-styled';
import Animated, { SlideInDown, SlideOutDown, SlideOutUp } from 'react-native-reanimated';
import { captureRef } from 'react-native-view-shot';
import { z } from 'zod';

import { Button } from '../ui/button';
import { Card, CardFooter, CardHeader } from '../ui/card';
import { IconWrapper } from '../ui/icon-wrapper';
import { Input } from '../ui/input';
import { Modal } from '../ui/modal';
import { H3 } from '../ui/typography';
import { NAV_THEME } from '~/constants/theme';
import { parseCurrency } from '~/lib/formatCurrency';
import { supabase } from '~/lib/supabase';
import { useHaptics } from '~/lib/use-haptics';
import { cn, uuid } from '~/lib/utils';
import { account$ } from '~/stores/account.store';

const AmountSchema = z.object({
	amount: z.preprocess(
		(val) => Number.parseFloat(val as string),
		z.number().positive('Amount must be greater than 0').min(0.01, 'Amount must be at least 0.01')
	),
});
type AmountFormValues = z.infer<typeof AmountSchema>;

export const RequestButton = () => {
	const accountId$ = use$(account$.accountId);
	const requestModal = useRef<BottomSheetModal>(null);
	const { triggerHaptics } = useHaptics();
	const qrCodeRef = useRef(null);

	const {
		control,
		handleSubmit,
		getValues,
		reset,
		formState: { errors, isValid, isDirty },
	} = useForm<AmountFormValues>({
		resolver: zodResolver(AmountSchema),
		defaultValues: {
			amount: 0,
		},
	});

	const [reference, setReference] = useState<string | null>(null);
	const amount = getValues('amount');
	const handleClose = () => {
		Keyboard.dismiss();
		reset();
		setReference(null);
	};

	function handleRequest() {
		requestModal.current?.present();
	}

	const onSubmit = (data: AmountFormValues) => {
		if (!accountId$) return;
		setReference(uuid());
	};

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const handleTransactionInsert = (payload: any) => {
		if (payload.new.reference === reference) {
			triggerHaptics('notification-success');
			handleClose();
		}
	};

	supabase
		.channel('account-transaction')
		.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'transactions' }, handleTransactionInsert)
		.subscribe();

	const logoFromFile = require('~/assets/images/icon-for-qr-code.png');
	const handleShareQR = async () => {
		try {
			const uri = await captureRef(qrCodeRef, {
				format: 'jpg',
				quality: 1,
			});
			shareAsync(uri);
		} catch (error) {
			console.error('Failed to capture or share QR code:', error);
		}
	};

	return (
		<>
			<Button onPress={handleRequest} haptics="impact-light" variant={'link'} size={'lg'}>
				<IconWrapper>
					<Ionicons name="arrow-down-circle-outline" className="text-foreground" size={24} />
				</IconWrapper>
				<Text className="text-xs font-semibold text-muted-foreground">Request</Text>
			</Button>
			<Modal
				ref={requestModal}
				enablePanDownToClose={false}
				className={cn('transition-all duration-700', reference ? 'bg-cyan-50' : 'bg-card')}
				onDismiss={() => {
					handleClose();
				}}
			>
				{!reference && (
					<Animated.View entering={SlideInDown} exiting={SlideOutDown}>
						<Card>
							<CardHeader>
								<H3>Request Money</H3>
							</CardHeader>
							<CardFooter className="flex flex-col gap-4">
								<View className="flex flex-col gap-2">
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
													autoFocus
													onChangeText={(text) => onChange(parseCurrency(text))}
													placeholder="Enter amount"
												/>
											</View>
										)}
									/>
									{errors.amount && <Text className="text-red-500">{errors.amount.message}</Text>}
								</View>
								<View className="flex w-full flex-row justify-between gap-2">
									<Button variant={'outline'} className="w-1/2" onPress={() => requestModal.current?.dismiss()}>
										<Text className="text-foreground"> Cancel</Text>
									</Button>
									<Button className="w-1/2" onPress={handleSubmit(onSubmit)}>
										<Text className="text-primary-foreground">Create QR Code</Text>
									</Button>
								</View>
							</CardFooter>
						</Card>
					</Animated.View>
				)}

				{reference && isValid && (
					<Animated.View entering={SlideInDown} exiting={SlideOutUp}>
						<Button
							variant={'ghost'}
							size={'icon'}
							onPress={handleShareQR}
							className="absolute inset-0 left-2 top-0 z-50"
						>
							<Ionicons name="share-outline" className="text-foreground" size={24} />
						</Button>

						<H3 className={cn('text-center', reference ? 'text-neutral-800' : '')}>Payment Request</H3>
						<View className="items-center rounded-xl p-6">
							<Text
								className={cn('mb-6 text-2xl font-bold', reference ? 'text-neutral-800' : 'text-accent-foreground')}
							>
								£{amount}
							</Text>
							<View>
								<QRCodeStyled
									ref={qrCodeRef}
									data={JSON.stringify({
										type: 'payment_request',
										accountId: accountId$,
										amount,
										reference,
									})}
									padding={5}
									pieceSize={6}
									pieceCornerType="rounded"
									isPiecesGlued
									pieceBorderRadius={2}
									outerEyesOptions={{
										borderRadius: 10,
										color: NAV_THEME.dark.primary,
										strokeWidth: 2,
										stroke: NAV_THEME.dark.primary,
									}}
									logo={{
										href: logoFromFile,
										hidePieces: false,
										scale: 1.1,
									}}
								/>
							</View>
							<Button
								className="mt-20 w-full max-w-sm"
								variant={'default'}
								onPress={() => {
									requestModal.current?.dismiss();
								}}
							>
								<Text className="text-primary-foreground">Close</Text>
							</Button>
						</View>
					</Animated.View>
				)}
			</Modal>
		</>
	);
};
