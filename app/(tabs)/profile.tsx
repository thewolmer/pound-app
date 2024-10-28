import * as React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeToggle } from '~/components/ThemeToggle';
import { SignOutIcon } from '~/components/icons/SignOutIcon';
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
				<Button onPress={signOut} variant="ghost">
					<SignOutIcon className={buttonTextVariants({ variant: 'ghost' })} />
				</Button>
			</View>
		</SafeAreaView>
	);
}
