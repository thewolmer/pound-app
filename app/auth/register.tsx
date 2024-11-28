import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { isAuthApiError } from '@supabase/supabase-js';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInRight, SlideOutLeft } from 'react-native-reanimated';
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

const PasswordRequirements = ({ password }: { password: string }) => {
	const requirements = [
		{ regex: /[A-Z]/, message: 'at least one uppercase letter' },
		{ regex: /[0-9]/, message: 'at least one number' },
		{ regex: /.{8,}/, message: '8 or more characters' },
	];

	return (
		<View className="gap-1 py-2">
			<Text className="text-muted-foreground">Your password must contain</Text>
			{requirements.map((req, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
				<View key={index} className="flex flex-row items-center">
					{password.match(req.regex) ? (
						<Ionicons name="checkmark-outline" size={18} className="text-foreground" />
					) : (
						<Ionicons name="remove-outline" size={18} className="text-foreground" />
					)}
					<Text className={cn(password.match(req.regex) ? 'text-green-500' : 'text-red-500', 'pl-2')}>
						{req.message}
					</Text>
				</View>
			))}
		</View>
	);
};

export default function Register() {
	const { signUp } = useSession();
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const { triggerHaptics } = useHaptics();
	const [form, setForm] = useState<RegisterForm>({
		email: '',
		password: '',
		confirmPassword: '',
	});
	const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
	const [step, setStep] = useState(1);
	const [isSubmitting, setIsSubmitting] = useState(false);

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
			triggerHaptics('impact-light');
		} catch (err) {
			if (err instanceof z.ZodError) {
				const fieldErrors: { [key: string]: string } = {};
				for (const error of err.errors) {
					fieldErrors[error.path[0]] = error.message;
				}
				setErrors(fieldErrors);
				triggerHaptics('notification-error');
			}
		}
	};

	const handleRegister = async () => {
		setIsSubmitting(true);
		try {
			await signUp(form.email, form.password);
			triggerHaptics('notification-success');
			router.replace('/');
		} catch (err) {
			if (isAuthApiError(err) && err.code === 'user_already_exists') {
				setErrors({ email: 'User already exists' });
			} else {
				setErrors({ email: 'An error occurred during registration' });
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

	return (
		<SafeAreaView className="flex-1 items-center bg-background p-10">
			<View className="w-full max-w-sm gap-8">
				<View className="gap-2">
					<View className="w-52">
						<PoundIcon />
					</View>
					<View className="flex flex-row gap-2 text-lg">
						{step > 1 && form.email ? (
							<View className="flex flex-row gap-2">
								<Text className="max-w-[90%] truncate text-muted-foreground">{form.email}</Text>
								<Pressable onPress={() => setStep(1)}>
									<Text className="font-semibold text-accent-foreground">Change?</Text>
								</Pressable>
							</View>
						) : (
							<Text>Create a New Account </Text>
						)}
					</View>
				</View>

				<View className="gap-4">
					{step === 1 && (
						<Animated.View entering={SlideInRight} exiting={SlideOutLeft}>
							<P className={cn('px-1 text-sm text-red-500', errors.email ? 'opacity-100' : 'opacity-0')}>
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
								className={cn(errors.email && 'border-red-500')}
								onSubmitEditing={handleNextStep}
							/>
						</Animated.View>
					)}

					{step === 2 && (
						<Animated.View entering={SlideInRight} exiting={SlideOutLeft}>
							<View className="flex flex-row items-center justify-between gap-1">
								<Input
									placeholder="Password"
									value={form.password}
									onChangeText={handleChange('password')}
									secureTextEntry={!showPassword}
									returnKeyType="next"
									autoFocus
									className="w-[90%]"
									onSubmitEditing={handleNextStep}
								/>
								{form.password && (
									<AnimatedPressable
										entering={FadeIn}
										exiting={FadeOut}
										onPress={() => setShowPassword((prev) => !prev)}
										className="w-[10%] p-1"
									>
										{!showPassword ? (
											<Ionicons name="eye-outline" size={24} className="text-foreground" />
										) : (
											<Ionicons name="eye-off-outline" size={24} className="text-foreground" />
										)}
									</AnimatedPressable>
								)}
							</View>
							<PasswordRequirements password={form.password} />
						</Animated.View>
					)}

					{step === 3 && (
						<Animated.View entering={SlideInRight} exiting={SlideOutLeft}>
							<P className={cn('px-1 text-sm text-red-500', errors.confirmPassword ? 'opacity-100' : 'opacity-0')}>
								{errors.confirmPassword ? errors.confirmPassword : 'Password'}
							</P>
							<View className="flex flex-row items-center justify-between gap-1">
								<Input
									placeholder="Confirm Password"
									value={form.confirmPassword}
									onChangeText={handleChange('confirmPassword')}
									secureTextEntry={!showPassword}
									returnKeyType="next"
									autoFocus
									className="w-[90%]"
									onSubmitEditing={handleNextStep}
								/>

								{form.confirmPassword && (
									<AnimatedPressable
										entering={FadeIn}
										exiting={FadeOut}
										onPress={() => setShowPassword((prev) => !prev)}
										className="w-[10%]"
									>
										{!showPassword ? (
											<Ionicons name="eye-outline" size={24} className="text-foreground" />
										) : (
											<Ionicons name="eye-off-outline" size={24} className="text-foreground" />
										)}
									</AnimatedPressable>
								)}
							</View>
						</Animated.View>
					)}
				</View>

				{/* incase of user already exists */}
				{step >= 3 && errors.email && <P className="text-center text-xs text-red-500">{errors.email}</P>}

				<Button
					onPress={step < 3 ? handleNextStep : handleRegister}
					disabled={isSubmitting}
					className="flex-row items-center"
				>
					{isSubmitting ? <ActivityIndicator size="small" color="white" className="mr-2" /> : null}
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
