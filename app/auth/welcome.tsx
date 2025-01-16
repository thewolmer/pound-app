import { useCallback, useEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal, useBottomSheetModal } from '@gorhom/bottom-sheet';
import { Link } from 'expo-router';
import { Dimensions, FlatList, Image, StyleSheet, View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Modal } from '~/components/ui/modal';
import { Text } from '~/components/ui/text';

const placeholderImages = [
	{ src: 'https://images.beta.cosmos.so/b261a007-3388-45ff-a2f9-f9004259ebec?format=png', background: '#202020' },
	{ src: 'https://images.beta.cosmos.so/b261a007-3388-45ff-a2f9-f9004259ebec?format=png', background: '#fecaca' },
	{ src: 'https://images.beta.cosmos.so/b261a007-3388-45ff-a2f9-f9004259ebec?format=png', background: '#bfdbfe' },
	{ src: 'https://images.beta.cosmos.so/b261a007-3388-45ff-a2f9-f9004259ebec?format=png', background: '#bbf7d0' },
	{ src: 'https://images.beta.cosmos.so/b261a007-3388-45ff-a2f9-f9004259ebec?format=png', background: '#fef08a' },
];
const { width, height } = Dimensions.get('screen');

export default function Welcome() {
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const { dismiss } = useBottomSheetModal();
	const carouselRef = useRef<FlatList>(null);
	const [currentIndex, setCurrentIndex] = useState(0);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	const handlePresentModalPress = useCallback(() => {
		bottomSheetModalRef.current?.present();
	}, []);

	const startAutoplay = () => {
		clearInterval(intervalRef.current as unknown as number);
		intervalRef.current = setInterval(() => {
			setCurrentIndex((prevIndex) => {
				const nextIndex = prevIndex + 1 >= placeholderImages.length ? 0 : prevIndex + 1;
				carouselRef.current?.scrollToIndex({ index: nextIndex, animated: true });
				return nextIndex;
			});
		}, 4000);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		startAutoplay();
		return () => clearInterval(intervalRef.current as unknown as number);
	}, [currentIndex]);

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const onScroll = (event: any) => {
		const scrollPosition = event.nativeEvent.contentOffset.x;
		const index = Math.round(scrollPosition / width);
		if (index !== currentIndex) {
			setCurrentIndex(index);
			startAutoplay();
		}
	};

	return (
		<View className="flex-1 items-center justify-end p-6" style={{ paddingBottom: height / 8 }}>
			{/* Carousel */}
			<FlatList
				ref={carouselRef}
				data={placeholderImages}
				horizontal
				pagingEnabled
				className="absolute left-0 top-0"
				style={StyleSheet.absoluteFillObject}
				showsHorizontalScrollIndicator={false}
				keyExtractor={(item, index) => index.toString()}
				onScroll={onScroll}
				scrollEventThrottle={16}
				renderItem={({ item }) => (
					<View
						className="flex-1 items-center justify-center"
						style={{ width, height, backgroundColor: item.background }}
					>
						<Image source={{ uri: item.src }} style={{ width: width, height: height, resizeMode: 'contain' }} />
					</View>
				)}
			/>

			<Button size={'lg'} onPress={handlePresentModalPress}>
				<Text>Get Started</Text>
			</Button>

			<Modal snapPoints={['50%']} ref={bottomSheetModalRef}>
				<View className="gap-5 py-4">
					<Button variant="outline" size={'lg'} className="flex w-full flex-row gap-4" onPress={() => dismiss()}>
						<Ionicons name="logo-google" size={24} className="text-foreground" />
						<Text className="font-bold">Continue with Google</Text>
					</Button>
					<Button variant="outline" size={'lg'} className="flex w-full flex-row gap-4" onPress={() => dismiss()}>
						<Ionicons name="logo-apple" size={28} className="text-foreground" />
						<Text className="font-bold">Continue with Apple</Text>
					</Button>
					<View className="my-2 w-full border border-border/50" />
					<Link href="/auth/login" asChild onPress={() => dismiss()}>
						<Button variant="secondary" size={'lg'} className="w-full">
							<Text className="font-bold">Login with email</Text>
						</Button>
					</Link>
					<Link href="/auth/register" asChild onPress={() => dismiss()}>
						<Button variant="default" size={'lg'} className="w-full">
							<Text className="font-bold">Sign Up with email</Text>
						</Button>
					</Link>
				</View>
			</Modal>
		</View>
	);
}
