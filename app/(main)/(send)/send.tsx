import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '~/components/ui/button';
import { Card, CardFooter, CardHeader } from '~/components/ui/card';
import { H4 } from '~/components/ui/typography';
import { SendViaContact } from './_components/SendViaContact';
import { SendViaPoundTag } from './_components/SendViaPoundTag';

export default function SendScreen() {
	return (
		<>
			<ScrollView contentInsetAdjustmentBehavior="automatic" className="flex h-full w-full px-5">
				<SafeAreaView>
					<SendViaPoundTag />
					<SendViaContact />
					<Card className="mb-3 flex flex-row items-center justify-between px-4">
						<View className="flex w-[85%] flex-row items-center">
							<Ionicons name="qr-code" size={38} className="text-foreground" />
							<View>
								<CardHeader className="pb-0">
									<H4>Send by scanning QR</H4>
								</CardHeader>
								<CardFooter>
									<Text className=" w-[95%] truncate text-muted-foreground text-sm">
										Send money by scanning someone's QR code.
									</Text>
								</CardFooter>
							</View>
						</View>
						<Button variant="link" onPress={() => router.push('/(tabs)/scan')}>
							<Ionicons name="chevron-forward-outline" size={24} className="text-foreground" />
						</Button>
					</Card>
				</SafeAreaView>
			</ScrollView>
		</>
	);
}
