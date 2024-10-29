import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';
import { PoundIcon } from '~/components/icons/PoundIcon';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';

import { useSession } from '~/context/SessionContext';
import { useHaptics } from '~/lib/useHaptics';

const loginSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
	const { signIn } = useSession();
	const router = useRouter();
	const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
	const [errors, setErrors] = useState<Partial<LoginForm>>({});

	const handleChange = (field: keyof LoginForm) => (value: string) => {
		setForm((prev) => ({ ...prev, [field]: value }));
		// Clear the error for this field when the user starts typing
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		}
	};

	const handleLogin = async () => {
		try {
			// Validate the form
			loginSchema.parse(form);

			// If validation passes, attempt to sign in
			await signIn(form.email, form.password);
			useHaptics('notification-success');
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
				useHaptics('notification-error');
			} else {
				// Handle other errors (e.g., network errors)
				setErrors({ password: 'Invalid email or password' });
				useHaptics('notification-error');
			}
		}
	};

	return (
		<SafeAreaView className="flex-1 items-center bg-background p-10">
			<View className="w-full max-w-sm gap-8">
				<View className="w-52 gap-2">
					<PoundIcon />
					<Text className="text-lg">Welcome Back!</Text>
				</View>
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
					/>
					{errors.email && <Text className="text-destructive text-sm">{errors.email}</Text>}

					<Input placeholder="Password" value={form.password} onChangeText={handleChange('password')} secureTextEntry />
					{errors.password && <Text className="text-destructive text-sm">{errors.password}</Text>}
				</View>

				<Button onPress={handleLogin}>
					<Text className="text-center font-body font-semibold">Login</Text>
				</Button>

				<View className="flex-row justify-center">
					<Text>Don't have an account? </Text>
					<Pressable onPress={() => router.push('/auth/register')}>
						<Text className="font-semibold text-primary">Sign Up</Text>
					</Pressable>
				</View>
			</View>
		</SafeAreaView>
	);
}
