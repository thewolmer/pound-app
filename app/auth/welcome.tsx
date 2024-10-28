import { Link } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

export default function Welcome() {
	return (
		<SafeAreaView className="flex-1 bg-background">
			<View className="flex-1 items-center justify-center px-6">
				<Text className="mb-2 font-bold text-4xl text-foreground">Welcome</Text>
				<Text className="mb-12 text-base text-muted-foreground">Get started with your account</Text>

				<View className="w-full flex-row justify-center gap-4">
					<Link href="/auth/login" asChild>
						<Button variant="default" className="w-2/5">
							<Text>Login</Text>
						</Button>
					</Link>

					<Link href="/auth/register" asChild>
						<Button variant="outline" className="w-2/5">
							<Text>Sign Up</Text>
						</Button>
					</Link>
				</View>
			</View>
		</SafeAreaView>
	);
}
