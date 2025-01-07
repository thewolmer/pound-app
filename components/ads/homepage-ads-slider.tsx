import React from 'react';
import { Dimensions, Image, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const { width } = Dimensions.get('screen');

const placeholderImages = [
	{ src: 'https://placehold.co/390x50.png?text=Ad+1&font=oswald', background: '#202020' },
	{ src: 'https://placehold.co/390x50.png?text=Ad+2&font=playfair-display', background: '#fecaca' },
	{ src: 'https://placehold.co/390x50.png?text=Ad+3&font=raleway', background: '#bfdbfe' },
	{ src: 'https://placehold.co/390x50.png?text=Ad+4&font=montserrat', background: '#bbf7d0' },
	{ src: 'https://placehold.co/390x50.png?text=Ad+5&font=lora', background: '#fef08a' },
];

export function HomePageAdsSlider() {
	return (
		<View className="flex h-[50px] w-full items-center justify-center">
			<Carousel
				loop
				autoPlay
				autoPlayInterval={4000}
				width={width * 0.9}
				height={50}
				data={placeholderImages}
				scrollAnimationDuration={800}
				renderItem={({ item }) => (
					<View
						className="h-[50px] w-full items-center justify-center rounded-2xl border border-border"
						style={{ backgroundColor: item.background }}
					>
						<Image
							source={{ uri: item.src }}
							style={{ width: width * 0.9, height: 50, resizeMode: 'cover' }}
							className="rounded-2xl"
						/>
					</View>
				)}
			/>
		</View>
	);
}
