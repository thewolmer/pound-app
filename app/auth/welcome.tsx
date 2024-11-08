import { Ionicons } from '@expo/vector-icons';
import { BottomSheetBackdrop, type BottomSheetBackdropProps, BottomSheetView } from '@gorhom/bottom-sheet';
import BottomSheet from '@gorhom/bottom-sheet';
import { Link } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, View } from 'react-native';
import { Button } from '~/components/ui/button';
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
	const bottomSheetModalRef = useRef<BottomSheet>(null);
	const carouselRef = useRef<FlatList>(null);
	const [currentIndex, setCurrentIndex] = useState(0);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	const handlePresentModalPress = useCallback(() => {
		bottomSheetModalRef.current?.snapToIndex(0);
	}, []);

	const renderBackDrop = useCallback(
		(backdropProps: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...backdropProps} />
		),
		[],
	);

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
				className="absolute top-0 left-0"
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

			<Button size={'lg'} onPress={handlePresentModalPress} className="w-full">
				<Text>Get Started</Text>
			</Button>

			<BottomSheet
				backdropComponent={renderBackDrop}
				snapPoints={['50%']}
				index={-1}
				enablePanDownToClose
				ref={bottomSheetModalRef}
			>
				<BottomSheetView className="flex-1 gap-4 p-5">
					<Button variant="outline" size={'lg'} className="flex w-full flex-row gap-4">
						<Ionicons name="logo-google" size={24} className="text-foreground" />
						<Text className="font-bold">Continue with Google</Text>
					</Button>

					<Button variant="outline" size={'lg'} className="flex w-full flex-row gap-4">
						<Ionicons name="logo-apple" size={28} className="text-foreground" />
						<Text className="font-bold">Continue with Apple</Text>
					</Button>

					<View className="my-2 w-full border border-border/50" />

					<Link href="/auth/login" asChild>
						<Button variant="secondary" size={'lg'} className="w-full">
							<Text className="font-bold">Login with email</Text>
						</Button>
					</Link>

					<Link href="/auth/register" asChild>
						<Button variant="default" size={'lg'} className="w-full">
							<Text className="font-bold">Sign Up with email</Text>
						</Button>
					</Link>
				</BottomSheetView>
			</BottomSheet>
		</View>
	);
}
