import { Pressable, View } from 'react-native';
import { SignOutIcon } from '~/components/icons/SignOutIcon';
import { useSession } from '~/context/SessionContext';
import { cn } from '~/lib/utils';

export function SignOutTemp() {
	const { session, signOut } = useSession();

	if (!session) return null;

	return (
		<Pressable
			onPress={() => {
				signOut();
			}}
			className="web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2"
		>
			{({ pressed }) => (
				<View
					className={cn('aspect-square flex-1 items-start justify-center web:px-5 pt-0.5', pressed && 'opacity-70')}
				>
					<SignOutIcon className="text-foreground" size={23} strokeWidth={1.25} />
				</View>
			)}
		</Pressable>
	);
}
