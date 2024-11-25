import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { useSession } from '~/context/SessionContext';
import { cn } from '~/lib/utils';
import { Button } from '../ui/button';

const UserSchema = z.object({
	first_name: z.string().min(1, 'First name is required').max(15, 'First name must be at most 10 characters'),
	last_name: z.string().min(1, 'Last name is required').max(15, 'Last name must be at most 10 characters'),
});

type UserFormValues = z.infer<typeof UserSchema>;

export const UserDetailsForm = () => {
	const { person, updatePerson } = useSession();

	if (!person) return null;

	const {
		control,
		handleSubmit,
		setValue,
		formState: { errors, isSubmitting, dirtyFields, isSubmitSuccessful },
	} = useForm<UserFormValues>({
		resolver: zodResolver(UserSchema),
		defaultValues: {
			first_name: person?.first_name || '',
			last_name: person?.last_name || '',
		},
	});

	const onSubmit = async (data: UserFormValues) => {
		try {
			await updatePerson(data);
			alert('Profile updated successfully');
		} catch (error) {
			alert('Failed to update profile');
			console.error(error);
		}
	};

	const isChanged = !!Object.keys(dirtyFields).length;
	const hasErrors = !!Object.keys(errors).length;

	return (
		<SafeAreaView className="flex-1 p-4">
			<ScrollView>
				<Text className="mb-4 font-semibold text-muted-foreground text-xl">Edit Profile Details</Text>

				{/* First Name */}
				<View className="mb-4">
					<Label className={cn(errors.first_name && 'text-destructive-foreground')}>
						{errors.first_name ? errors.first_name.message : 'First Name'}
					</Label>
					<Controller
						name="first_name"
						control={control}
						render={({ field: { onChange, value } }) => (
							<Input
								value={value}
								onChangeText={onChange}
								className={cn(errors.first_name && 'border-destructive-foreground placeholder:text-destructive')}
								placeholder={'Enter your First name'}
							/>
						)}
					/>
				</View>

				{/* Last Name */}
				<View className="mb-4">
					<Label className={cn(errors.last_name && 'text-destructive-foreground')}>
						{errors.last_name ? errors.last_name.message : 'Last Name'}
					</Label>
					<Controller
						name="last_name"
						control={control}
						render={({ field: { onChange, value } }) => (
							<Input
								value={value}
								className={cn(errors.last_name && 'border-destructive-foreground placeholder:text-destructive')}
								onChangeText={onChange}
								placeholder="Enter your Last name"
							/>
						)}
					/>
				</View>

				{/* Submit Button */}
				<View className="mt-6">
					<Button
						onPress={handleSubmit(onSubmit)}
						disabled={isSubmitting || !isChanged || hasErrors || isSubmitSuccessful}
					>
						<Text className="text-primary-foreground">{isSubmitting ? 'Saving...' : 'Save Changes'}</Text>
					</Button>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};
