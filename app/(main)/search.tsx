import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut, FadeOutDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { useDebounce } from '~/hooks/useDebounce';

const Search = () => {
	const router = useRouter();

	const { control, watch } = useForm({
		defaultValues: {
			searchQuery: '',
		},
	});

	const searchQuery = watch('searchQuery');

	const debouncedSearchQuery = useDebounce(searchQuery, 500);

	React.useEffect(() => {
		if (debouncedSearchQuery) {
			console.log('Searching for:', debouncedSearchQuery);
		}
	}, [debouncedSearchQuery]);

	return (
		<>
			<SafeAreaView>
				<View className="mt-5 px-5">
					<View className="mb-5 flex flex-row items-center justify-between">
						<Button variant={'link'} size={'icon'} className="mr-2" onPress={() => router.back()}>
							<Ionicons name="arrow-back" size={24} className="text-foreground" />
						</Button>
						<Controller
							name="searchQuery"
							control={control}
							render={({ field: { onChange, value } }) => (
								<Input
									value={value}
									className=""
									leftIcon="search"
									onChangeText={onChange}
									placeholder="Search poundtag, user, business"
								/>
							)}
						/>
					</View>
					{!searchQuery && (
						<Animated.View entering={FadeInDown} exiting={FadeOut}>
							<CategoryWrapper title="Recent">
								<View className="flex flex-row items-center justify-between">
									{Array.from({ length: 5 }).map((_, index) => (
										<View key={index} className="flex-row items-center p-2">
											<View className="flex-row items-center gap-4">
												<View className="relative h-12 w-12 animate-pulse rounded-2xl bg-muted p-2"></View>
											</View>
										</View>
									))}
								</View>
							</CategoryWrapper>
						</Animated.View>
					)}

					{searchQuery && (
						<Animated.View entering={FadeInDown} exiting={FadeOut}>
							<CategoryWrapper title="Search Results">
								<View className="flex items-start justify-between">
									{Array.from({ length: 4 }).map((_, index) => (
										<View key={index} className="flex-row items-center gap-10 p-2">
											<View className="flex-row items-center gap-4">
												<View className="relative h-12 w-12 animate-pulse rounded-2xl bg-muted p-2"></View>
											</View>
											<View className="gap-2">
												<View className="animate-pulse rounded-full bg-muted px-14 py-2" />
												<View className="animate-pulse rounded-full bg-muted px-4 py-1" />
											</View>
										</View>
									))}
								</View>
							</CategoryWrapper>
						</Animated.View>
					)}
				</View>
			</SafeAreaView>
		</>
	);
};

const CategoryWrapper = ({ children, title }: { children: React.ReactNode; title: string }) => {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center">
				<Text className="font-bold text-muted-foreground">{title}</Text>
			</CardHeader>
			<CardContent>{children}</CardContent>
		</Card>
	);
};
export default Search;
