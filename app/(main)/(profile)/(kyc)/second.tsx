import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useAtom } from 'jotai';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import { z } from 'zod';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { addressAtom } from '~/lib/atoms';

// Define Zod schema for validation
const addressSchema = z.object({
	line1: z.string().min(1, 'Line 1 is required.'),
	line2: z.string().optional(),
	city: z.string().min(1, 'City is required.'),
	state: z.string().min(1, 'State is required.'),
	country: z.string().min(1, 'Country is required.'),
	postal: z
		.string()
		.regex(/^\d{5,6}$/, 'Pin Code must be 5 or 6 digits.')
		.min(1, 'Pin Code is required.'),
});

// Infer form data type from Zod schema
type AddressFormData = z.infer<typeof addressSchema>;

export default function AddressForm() {
	type Address = z.infer<typeof addressSchema>;
	const [address, setAddress] = useAtom<Address | any>(addressAtom);

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<AddressFormData>({
		resolver: zodResolver(addressSchema), // Use Zod for validation
		defaultValues: address as Address, // Initialize with atom values
	});

	// Sync form with atom whenever address updates
	useEffect(() => {
		reset(address as Address);
	}, [address, reset]);

	const onSubmit = (data: AddressFormData) => {
		setAddress(data as Address); // Update atom
		router.navigate('/(main)/(profile)/(kyc)/addressUpload'); // Go back if possible
	};

	return (
		<View className="flex-1 p-4">
			<Text className="mb-4 text-xl font-bold">Address Form</Text>

			{[
				{ name: 'line1', placeholder: 'Line 1', isOptional: false },
				{ name: 'line2', placeholder: 'Line 2 (Optional)', isOptional: true },
				{ name: 'city', placeholder: 'City', isOptional: false },
				{ name: 'state', placeholder: 'State', isOptional: false },
				{ name: 'country', placeholder: 'Country', isOptional: false },
				{ name: 'postal', placeholder: 'Postal Code', isOptional: false, keyboardType: 'numeric' },
			].map(({ name, placeholder, isOptional, keyboardType }) => (
				<Controller
					key={name}
					name={name as keyof AddressFormData}
					control={control}
					render={({ field: { onChange, onBlur, value } }) => (
						<View className="mb-4">
							<Text className="mb-1 font-semibold">
								{placeholder} {isOptional && <Text className="text-gray-500">(Optional)</Text>}
							</Text>
							<Input
								placeholder={placeholder}
								onBlur={onBlur}
								onChangeText={onChange}
								value={value}
								keyboardType={keyboardType || 'default'}
							/>
							{errors[name as keyof AddressFormData] && (
								<Text className="mt-1 text-red-500">{errors[name as keyof AddressFormData]?.message}</Text>
							)}
						</View>
					)}
				/>
			))}

			<Button onPress={handleSubmit(onSubmit)}>
				<Text className="text-primary-foreground">Save Address</Text>
			</Button>
		</View>
	);
}
