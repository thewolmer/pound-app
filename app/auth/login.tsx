import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { AuthApiError } from '@supabase/supabase-js';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

import { PoundIcon } from '~/components/icons/pound-icon';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { signIn } from '~/lib/auth';
import { useHaptics } from '~/lib/use-haptics';
import { cn } from '~/lib/utils';

const loginSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
	const router = useRouter();
	const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
	const [errors, setErrors] = useState<Partial<LoginForm>>({});
	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { triggerHaptics } = useHaptics();

	const handleChange = (field: keyof LoginForm) => (value: string) => {
		setForm((prev) => ({ ...prev, [field]: value }));
		// Clear the error for this field when the user starts typing
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		}
	};

	const handleLogin = async () => {
		setIsSubmitting(true);
		try {
			// Validate the form
			loginSchema.parse(form);

			// If validation passes, attempt to sign in
			await signIn(form.email, form.password);
			triggerHaptics('notification-success');
			router.replace('/');
		} catch (err) {
			if (err instanceof z.ZodError) {
				// Set form errors
				const fieldErrors: Partial<LoginForm> = {};
				for (const error of err.errors) {
					if (error.path[0] as keyof LoginForm) {
						fieldErrors[error.path[0] as keyof LoginForm] = error.message;
					}
				}
				setErrors(fieldErrors);
			} else if (err instanceof AuthApiError) {
				setErrors({ password: err.message });
			} else {
				// Handle other errors (e.g., network errors)
				setErrors({ password: 'Invalid email or password' });
			}
			triggerHaptics('notification-error');
		} finally {
			setIsSubmitting(false);
		}
	};

	const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

	return (
		<SafeAreaView className="flex-1 bg-background p-10">
			<View className="mb-5 w-52 gap-2">
				<PoundIcon />
				<Text className="text-lg">Welcome Back!</Text>
			</View>
			<View className="w-full max-w-sm gap-6">
				<View className="gap-4">
					<Input
						placeholder="Email"
						value={form.email}
						onChangeText={handleChange('email')}
						inputMode="email"
						autoCapitalize="none"
						returnKeyType="done"
						autoFocus
						onSubmitEditing={handleLogin}
						className={cn(errors.email && 'border-red-500')}
					/>
					{errors.email && <Text className="text-sm text-red-500">{errors.email}</Text>}
					<View className="flex flex-row items-center justify-between gap-1">
						<Input
							placeholder="Password"
							value={form.password}
							onChangeText={handleChange('password')}
							secureTextEntry={!showPassword}
							className={cn(errors.password && 'border-red-500', form.password ? 'w-[90%]' : 'w-full')}
						/>
						{form.password && (
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
					{errors.password && <Text className="text-sm text-red-500">{errors.password}</Text>}
				</View>

				<Button onPress={handleLogin} disabled={isSubmitting} className="flex-row items-center">
					{isSubmitting ? <ActivityIndicator size="small" color="white" className="mr-2" /> : null}
					<Text className="text-center font-semibold">Log In</Text>
				</Button>

				<View className="flex-row justify-center">
					<Text>{`Don't have an account? `}</Text>
					<Pressable onPress={() => router.push('/auth/register')}>
						<Text className="font-semibold text-primary">{`Sign Up`}</Text>
					</Pressable>
				</View>
			</View>
		</SafeAreaView>
	);
}
