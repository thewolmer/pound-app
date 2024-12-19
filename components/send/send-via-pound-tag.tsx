import React, { useCallback, useRef } from 'react';
import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetTextInput,
	BottomSheetView,
} from '@gorhom/bottom-sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { z } from 'zod';

import { Input } from '../ui/input';
import { Button } from '~/components/ui/button';
import { ForwardCard } from '~/components/ui/forward-card';
import { H3 } from '~/components/ui/typography';
import { useSession } from '~/context/SessionContext';
import { supabase } from '~/lib/supabase';

// Zod Schema
const PoundTagSchema = z.object({
	poundTag: z.string().nonempty('Pound tag is required').min(3, 'Pound tag must be at least 3 characters long'),
});

type PoundTagFormValues = z.infer<typeof PoundTagSchema>;

export const SendViaPoundTag = () => {
	const poundTagModalRef = useRef<BottomSheetModal>(null);
	const { session } = useSession();

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<PoundTagFormValues>({
		resolver: zodResolver(PoundTagSchema),
		defaultValues: { poundTag: '' },
	});

	const renderBackDrop = useCallback(
		(backdropProps: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...backdropProps} />
		),
		[]
	);

	const handleVerifyTag = async (data: PoundTagFormValues) => {
		const { poundTag } = data;

		const { data: userData, error } = await supabase
			.from('account_details')
			.select()
			.eq('identity_tag', poundTag)
			.single();

		if (!userData) {
			alert(`${poundTag} is not a valid PoundTag`);
			return;
		}

		if (error) {
			alert('Something went wrong');
			return;
		}

		if (userData.person_id === session?.user.id) {
			alert('You cannot send money to yourself');
			return;
		}

		poundTagModalRef.current?.close();
		router.push({ pathname: '/(main)/(send)/amount', params: { account_details: JSON.stringify(userData) } });
	};

	const openPoundTagModal = () => {
		poundTagModalRef.current?.present();
	};

	return (
		<>
			<ForwardCard
				ionicons="id-card"
				title="Send via Pound Tag"
				description="Send money to someone using their pound tag."
				onPress={openPoundTagModal}
			/>
			<BottomSheetModal
				backdropComponent={renderBackDrop}
				ref={poundTagModalRef}
				snapPoints={['80%']}
				enableDynamicSizing
				enableDismissOnClose
				handleIndicatorStyle={{ backgroundColor: '#fff' }}
				backgroundStyle={{ backgroundColor: 'transparent' }}
			>
				<KeyboardAvoidingView
					keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					className="flex-1"
				>
					<BottomSheetView className="flex-1 gap-5 rounded-t-2xl bg-card p-5 py-10">
						<H3>Send Via Pound Tag</H3>

						{/* Form Input */}
						<Controller
							name="poundTag"
							control={control}
							render={({ field: { onChange, value } }) =>
								Platform.OS === 'ios' ? (
									<BottomSheetTextInput
										placeholder="poundtag"
										value={value}
										onChangeText={onChange}
										autoCapitalize="none"
										returnKeyType="next"
										className={`rounded-xl border border-border bg-muted p-2 text-foreground ${
											errors.poundTag ? 'border-destructive-foreground' : ''
										}`}
									/>
								) : (
									<Input
										placeholder="poundtag"
										value={value}
										onChangeText={onChange}
										autoCapitalize="none"
										returnKeyType="next"
										className={errors.poundTag ? 'border-destructive-foreground' : ''}
									/>
								)
							}
						/>
						{errors.poundTag && <Text className="text-destructive-foreground">{errors.poundTag.message}</Text>}

						{/* Submit Button */}
						<Button onPress={handleSubmit(handleVerifyTag)} className="mt-5">
							<Text className="text-white">Next</Text>
						</Button>

						{/* Info Section */}
						<View>
							<Text className="text-center text-sm text-muted-foreground">
								TODO: a section here to explain what a pound tag is
							</Text>
						</View>
					</BottomSheetView>
				</KeyboardAvoidingView>
			</BottomSheetModal>
		</>
	);
};
