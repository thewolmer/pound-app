import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { z } from 'zod';

import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { parseCurrency } from '~/lib/formatCurrency';
import type { Tables } from '~/types/database.types';

const AmountSchema = z.object({
	amount: z.preprocess(
		(val) => Number.parseFloat(val as string),
		z
			.number()
			.positive('Amount must be greater than 0')
			.min(0.01, 'Amount must be at least 0.01')
			.refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), 'Amount must have at most 2 decimal places')
	),
	message: z.string().max(30, 'Message is too long').nullable().optional(),
});

type AmountFormValues = z.infer<typeof AmountSchema>;

export default function AmountScreen() {
	const { account_details } = useLocalSearchParams<{ account_details?: string }>();

	const user = account_details ? (JSON.parse(account_details) as Tables<'account_details'>) : undefined;

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting, isDirty },
	} = useForm<AmountFormValues>({
		resolver: zodResolver(AmountSchema),
		defaultValues: {
			amount: 0,
			message: null,
		},
	});

	if (!account_details) return null;

	const onSubmit = (data: AmountFormValues) => {
		router.push({
			pathname: '/(main)/(send)/confirm',
			params: {
				account_details: JSON.stringify(user),
				amount: data.amount.toString(),
				message: data.message || '',
			},
		});
	};

	return (
		<SafeAreaView className="flex-1">
			<KeyboardAvoidingView
				keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				className="flex-1"
			>
				<ScrollView contentContainerStyle={{ padding: 16 }}>
					<Card>
						<CardHeader>
							<View className="flex flex-row items-center gap-2">
								<View>
									{user?.avatar_url ? (
										<View>
											<Image source={{ uri: user.avatar_url }} className="h-12 w-12 rounded-full shadow" />
										</View>
									) : (
										<View className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
											<Text className="text-center text-2xl text-foreground">{user?.display_name?.[0]}</Text>
										</View>
									)}
								</View>
								<View className="flex flex-col">
									<Text className="line-clamp-2 text-lg font-semibold text-foreground"> {user?.display_name}</Text>
									<Text className="line-clamp-1 text-sm font-semibold text-muted-foreground">
										{user?.identity_tag ? `@${user.identity_tag}` : ''}
									</Text>
								</View>
							</View>
						</CardHeader>
						<CardContent>
							{/* Amount Field */}
							<View className="mb-4">
								<Controller
									name="amount"
									control={control}
									render={({ field: { onChange, value } }) => (
										<View className="flex flex-row items-center justify-between gap-1">
											<Text className="w-[10%] text-2xl font-semibold text-muted-foreground">£</Text>
											<Input
												keyboardType="numeric"
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
							</View>

							{/* Message Field */}
							<View className="mb-4">
								<Controller
									name="message"
									control={control}
									render={({ field: { onChange, value } }) => (
										<Input
											value={value || ''}
											onChangeText={onChange}
											className="placeholder:text-sm placeholder:font-semibold placeholder:text-muted-foreground"
											placeholder="Add a note  (optional)"
										/>
									)}
								/>
								{errors.message && <Text className="text-red-500">{errors.message.message}</Text>}
							</View>
						</CardContent>
					</Card>
				</ScrollView>

				{/* Submit Button */}
				<View className="p-4">
					<Button disabled={isSubmitting || !isDirty} onPress={handleSubmit(onSubmit)} className="bg-primary">
						<Text className="text-primary-foreground">{isSubmitting ? 'Submitting...' : 'Next'}</Text>
					</Button>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}
