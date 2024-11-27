import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

export default function OfflineScreen() {
	return (
		<View className="flex-1 items-center justify-center gap-5">
			<View className="rounded-full bg-destructive p-2">
				<Ionicons name="wifi-outline" className="text-destructive-foreground" size={60} />
			</View>
			<View className="rounded-lg p-2 ">
				<Text className="text-center font-bold text-destructive-foreground text-lg"> Looks like you're Offline.</Text>
				<Text className="text-center font-semibold text-muted-foreground text-sm">Check your Network connection.</Text>
			</View>
		</View>
	);
}
