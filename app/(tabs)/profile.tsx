import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeToggle } from '~/components/ThemeToggle';
import { Button, buttonTextVariants } from '~/components/ui/button'; // Assuming you have a Button component
import { Text } from '~/components/ui/text';
import { useSession } from '~/context/SessionContext';

export default function Profile() {
	const { session, signOut } = useSession();

	return (
		<SafeAreaView className="flex-1 items-center justify-center gap-5 p-6">
			<Text>{session?.user.email}</Text>
			<View className="flex-row items-center justify-center">
				<ThemeToggle />
				<Button onPress={signOut} variant="ghost" size="icon" className="p-0">
					<Ionicons name="log-out-outline" size={24} className="text-foreground" />
				</Button>
			</View>
		</SafeAreaView>
	);
}
