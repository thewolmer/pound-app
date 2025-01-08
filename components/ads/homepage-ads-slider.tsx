import React from 'react';
import { Dimensions, Image, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const { width } = Dimensions.get('screen');

const placeholderImages = [
	{ src: 'https://placehold.co/390x100.png?text=Ad+1&font=oswald' },
	{ src: 'https://placehold.co/390x100.png?text=Ad+2&font=playfair-display' },
	{ src: 'https://placehold.co/390x100.png?text=Ad+3&font=raleway' },
	{ src: 'https://placehold.co/390x100.png?text=Ad+4&font=montserrat' },
	{ src: 'https://placehold.co/390x100.png?text=Ad+5&font=lora' },
];

export function HomePageAdsSlider() {
	return (
		<View className="flex h-[100px] w-full items-center justify-center">
			<Carousel
				loop
				autoPlay
				autoPlayInterval={4000}
				width={width * 0.9}
				height={100}
				data={placeholderImages}
				scrollAnimationDuration={800}
				renderItem={({ item }) => (
					<View className="h-[100px] w-full items-center justify-center rounded-2xl border border-border bg-accent">
						<Image
							source={{ uri: item.src }}
							style={{ width: width * 0.9, height: 100, resizeMode: 'cover' }}
							className="rounded-2xl"
						/>
					</View>
				)}
			/>
		</View>
	);
}
