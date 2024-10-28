import { SafeAreaView } from 'react-native-safe-area-context';
import { H1 } from '~/components/ui/typography';

export default function StartScreen() {
	return (
		<SafeAreaView className="flex-1 items-center justify-center gap-5 p-6">
			<H1>Hello</H1>
		</SafeAreaView>
	);
}
