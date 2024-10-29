import { isAuthApiError } from '@supabase/supabase-js';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';
import { PoundIcon } from '~/components/icons/PoundIcon';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { P } from '~/components/ui/typography';
import { useSession } from '~/context/SessionContext';
import { useHaptics } from '~/lib/useHaptics';
import { cn } from '~/lib/utils';

const emailSchema = z.object({
	email: z.string().email('Invalid email address'),
});

const passwordSchema = z.object({
	password: z
		.string()
		.min(8, 'Password must be at least 8 characters')
		.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
		.regex(/[0-9]/, 'Password must contain at least one number'),
});

const confirmPasswordSchema = z
	.object({
		password: z.string(),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

type RegisterForm = {
	email: string;
	password: string;
	confirmPassword: string;
};

export default function Register() {
	const { signUp } = useSession();
	const router = useRouter();
	const [form, setForm] = useState<RegisterForm>({
		email: '',
		password: '',
		confirmPassword: '',
	});
	const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
	const [step, setStep] = useState(1);

	const handleChange = (field: keyof RegisterForm) => (value: string) => {
		setForm((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: null }));
		}
	};

	const handleNextStep = () => {
		try {
			if (step === 1) emailSchema.parse({ email: form.email });
			if (step === 2) passwordSchema.parse({ password: form.password });
			if (step === 3)
				confirmPasswordSchema.parse({
					password: form.password,
					confirmPassword: form.confirmPassword,
				});

			setStep((prev) => prev + 1);
			useHaptics('impact-light');
		} catch (err) {
			if (err instanceof z.ZodError) {
				const fieldErrors: { [key: string]: string } = {};
				for (const error of err.errors) {
					fieldErrors[error.path[0]] = error.message;
				}
				setErrors(fieldErrors);
				useHaptics('notification-error');
			}
		}
	};

	const handleRegister = async () => {
		try {
			await signUp(form.email, form.password);
			useHaptics('notification-success');
			router.replace('/');
		} catch (err) {
			if (isAuthApiError(err) && err.code === 'user_already_exists') {
				setErrors({ email: 'User already exists' });
			} else {
				setErrors({ email: 'An error occurred during registration' });
			}
		}
	};

	return (
		<SafeAreaView className="flex-1 items-center bg-background p-10">
			<View className="w-full max-w-sm gap-8">
				<View className="w-52 gap-2">
					<PoundIcon />
					<View className="flex flex-row gap-2 text-lg">
						{step > 1 && form.email ? (
							<>
								<Text>{form.email}</Text>
								<Pressable onPress={() => setStep(1)}>
									<Text className="font-semibold text-primary">Change?</Text>
								</Pressable>
							</>
						) : (
							<Text>Create a New Account </Text>
						)}
					</View>
				</View>

				<View className="gap-4">
					{step === 1 && (
						<Animated.View entering={SlideInRight} exiting={SlideOutLeft}>
							<P className={cn('px-1 text-destructive text-sm', errors.email ? 'opacity-100' : 'opacity-0')}>
								{errors.email ? errors.email : 'Email'}
							</P>
							<Input
								placeholder="Email"
								value={form.email}
								onChangeText={handleChange('email')}
								inputMode="email"
								autoCapitalize="none"
								returnKeyType="next"
								autoFocus
								onSubmitEditing={handleNextStep}
							/>
						</Animated.View>
					)}

					{step === 2 && (
						<Animated.View entering={SlideInRight} exiting={SlideOutLeft}>
							<P className={cn('px-1 text-destructive text-sm', errors.password ? 'opacity-100' : 'opacity-0')}>
								{errors.password ? errors.password : 'Password'}
							</P>
							<Input
								placeholder="Password"
								value={form.password}
								onChangeText={handleChange('password')}
								secureTextEntry
								returnKeyType="next"
								autoFocus
								onSubmitEditing={handleNextStep}
							/>
						</Animated.View>
					)}

					{step === 3 && (
						<Animated.View entering={SlideInRight} exiting={SlideOutLeft}>
							<P className={cn('px-1 text-destructive text-sm', errors.confirmPassword ? 'opacity-100' : 'opacity-0')}>
								{errors.confirmPassword ? errors.confirmPassword : 'Password'}
							</P>
							<Input
								placeholder="Confirm Password"
								value={form.confirmPassword}
								onChangeText={handleChange('confirmPassword')}
								secureTextEntry
								returnKeyType="next"
								autoFocus
								onSubmitEditing={handleNextStep}
							/>
						</Animated.View>
					)}
				</View>

				{/* incase of user already exists */}
				{step >= 3 && errors.email && <P className="text-center text-destructive text-xs">{errors.email}</P>}

				<Button onPress={step < 3 ? handleNextStep : handleRegister}>
					<Text className="text-center font-semibold">{step < 3 ? 'Next' : 'Sign Up'}</Text>
				</Button>

				<View className="flex-row justify-center">
					<P>Already have an account? </P>
					<Pressable onPress={() => router.push('/auth/login')}>
						<P className="font-semibold text-primary">Log In</P>
					</Pressable>
				</View>
			</View>
		</SafeAreaView>
	);
}
