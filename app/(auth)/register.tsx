import { isAuthApiError } from '@supabase/supabase-js';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { z } from 'zod';
import { ManncoinIcon } from '~/components/icons/ManncoinIcon';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { Muted, P } from '~/components/ui/typography';
import { useSession } from '~/context/SessionContext';

const registerSchema = z
	.object({
		email: z.string().email('Invalid email address'),
		password: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
			.regex(/[0-9]/, 'Password must contain at least one number'),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
	const { signUp } = useSession();
	const router = useRouter();
	const [form, setForm] = useState<RegisterForm>({
		email: '',
		password: '',
		confirmPassword: '',
	});
	const [errors, setErrors] = useState<{ [key in keyof RegisterForm]?: string[] }>({});

	const handleChange = (field: keyof RegisterForm) => (value: string) => {
		setForm((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		}
	};

	const handleRegister = async () => {
		try {
			// Validate the form
			registerSchema.parse(form);

			// If validation passes, attempt to sign up
			await signUp(form.email, form.password);
			router.replace('/');
		} catch (err) {
			if (err instanceof z.ZodError) {
				// Set form errors
				const fieldErrors: { [key in keyof RegisterForm]?: string[] } = {};
				for (const error of err.errors) {
					const field = error.path[0] as keyof RegisterForm;
					if (field) {
						if (!fieldErrors[field]) {
							fieldErrors[field] = [];
						}
						fieldErrors[field].push(error.message);
					}
				}
				setErrors(fieldErrors);
				return;
			}

			if (isAuthApiError(err)) {
				if (err.code === 'user_already_exists') {
					setErrors({ email: ['User already exists'] });
				}
				console.log(JSON.stringify(err, null, 2));
				console.log(err.code);
				return;
			}

			// Handle other errors (e.g., network errors)
			setErrors({ email: ['An error occurred during registration'] });
		}
	};

	const renderErrors = (field: keyof RegisterForm) => {
		if (errors[field] && errors[field].length > 0) {
			return (
				<View className="mt-1">
					{errors[field].map((error, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: No other way to make it unique
						<P key={`${field}-error-${index}`} className="text-destructive text-sm">
							{error}
						</P>
					))}
				</View>
			);
		}
		return null;
	};

	return (
		<View className="flex-1 items-center bg-background p-6">
			<View className="w-full max-w-sm gap-8">
				<View className="flex items-center justify-center pt-8">
					<ManncoinIcon className="h-24 w-24" />
				</View>

				<View className="gap-4">
					<View>
						<Input
							placeholder="Email"
							value={form.email}
							onChangeText={handleChange('email')}
							inputMode="email"
							autoCapitalize="none"
						/>
						{renderErrors('email')}
					</View>
					<View>
						<Input
							placeholder="Password"
							value={form.password}
							onChangeText={handleChange('password')}
							secureTextEntry
						/>
						{renderErrors('password')}
					</View>
					<View>
						<Input
							placeholder="Confirm Password"
							value={form.confirmPassword}
							onChangeText={handleChange('confirmPassword')}
							secureTextEntry
						/>
						{renderErrors('confirmPassword')}
					</View>
				</View>

				<Button onPress={handleRegister}>
					<Text className="text-center font-semibold">Sign Up</Text>
				</Button>

				<View className="flex-row justify-center">
					<P>Already have an account? </P>
					<Pressable onPress={() => router.push('/login')}>
						<P className="font-semibold text-primary">Log In</P>
					</Pressable>
				</View>
			</View>
		</View>
	);
}
