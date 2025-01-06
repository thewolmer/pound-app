import React, { useCallback, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Link } from 'expo-router';
import { useAtom } from 'jotai/react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card as CardType } from '~/api/deposit/card.types';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardFooter, CardHeader } from '~/components/ui/card';
import { IconWrapper } from '~/components/ui/icon-wrapper';
import { Switch } from '~/components/ui/switch';
import { H4 } from '~/components/ui/typography';
import { defaultCardAtom } from '~/lib/atoms';
import { getCardIcon } from '~/lib/CardIcons';
import { useDeleteCard } from '~/lib/pound/use-delete.card';
import { useListCards } from '~/lib/pound/use-list-cards';
import { useHaptics } from '~/lib/useHaptics';
import { cn } from '~/lib/utils';

export default function ManageCards() {
	const menu = useRef<BottomSheetModal>(null);
	const [selectedCard, setSelectedCard] = React.useState<CardType | null>(null);
	const [defaultCard, setDefaultCard] = useAtom(defaultCardAtom);
	const { triggerHaptics } = useHaptics();

	const { data: cards } = useListCards();
	const { mutate: deleteCard } = useDeleteCard();
	const [confirmDelete, setConfirmDelete] = React.useState(false);

	const handleDelete = (tokenId: string) => {
		deleteCard(tokenId, {
			onSuccess: () => {
				menu.current?.close();
				if (defaultCard && defaultCard?.token === tokenId) {
					setDefaultCard(null);
				}
				console.log('Card deleted successfully');
			},
			onError: (error) => {
				console.error('Failed to delete card', error);
			},
		});
	};
	const renderBackDrop = useCallback(
		(backdropProps: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...backdropProps} />
		),
		[]
	);

	const renderTransaction = ({ item }: { item: CardType }) => {
		return (
			<Card key={item.token} className="border-border">
				<CardHeader>
					<View className="flex-row items-center justify-between">
						<View className="flex-row items-center">
							{getCardIcon(item.card.type)}
							<Text className="ml-2 font-semibold text-foreground">XXXX {item.card.last_4_digits}</Text>
						</View>
						<Pressable
							onPress={() => {
								triggerHaptics('impact-light');
								setSelectedCard(item);
								menu.current?.present();
							}}
						>
							<IconWrapper>
								<Ionicons name="ellipsis-horizontal" size={24} className="text-foreground" />
							</IconWrapper>
						</Pressable>
					</View>
				</CardHeader>
				<CardFooter>
					<View className="flex-row items-center justify-between">
						{defaultCard && defaultCard.token === item.token && (
							<Badge variant={'outline'} className="bg-success">
								<Text className="text-xs font-semibold capitalize text-success-foreground">Primary</Text>
							</Badge>
						)}
					</View>
				</CardFooter>
			</Card>
		);
	};

	return (
		<SafeAreaView className="flex-1">
			<ScrollView contentContainerStyle={{ padding: 16 }} contentInsetAdjustmentBehavior="automatic">
				<View className="flex flex-col gap-4">
					<FlatList
						data={cards}
						renderItem={renderTransaction}
						ListEmptyComponent={
							<View className="h-full w-full flex-1 items-center justify-center p-4">
								<Text className="py-6 text-muted-foreground"> TODO: maybe an illustration here</Text>
								<Link href={'/(main)/(deposit)/add-card'} asChild>
									<Button className="text-muted-foreground">
										<Text className="text-primary-foreground">Add your first Card.</Text>
									</Button>
								</Link>
							</View>
						}
					/>
				</View>
			</ScrollView>
			<BottomSheetModal
				backdropComponent={renderBackDrop}
				ref={menu}
				snapPoints={['45']}
				enableDismissOnClose
				handleIndicatorStyle={{ backgroundColor: '#fff' }}
				backgroundStyle={{ backgroundColor: 'transparent' }}
				onDismiss={() => {
					setSelectedCard(null);
					menu.current?.close();
				}}
			>
				<BottomSheetView className={cn('flex-1 gap-5 rounded-t-2xl bg-card p-5 transition-all duration-700')}>
					{selectedCard && (
						<>
							<View className="mb-6 flex-row items-center justify-center">
								{getCardIcon(selectedCard.card.type)}
								<Text className="ml-2 font-semibold text-foreground">XXXX {selectedCard.card.last_4_digits}</Text>
							</View>
							{!confirmDelete && (
								<Animated.View entering={SlideInDown} exiting={SlideOutDown} className="gap-4">
									<View>
										<CardHeader className="flex flex-row items-center justify-between">
											<Text className="font-semibold text-foreground"> Primary Card</Text>
											<Switch
												checked={defaultCard && defaultCard.token === selectedCard.token}
												onCheckedChange={() =>
													setDefaultCard(defaultCard?.token === selectedCard.token ? null : selectedCard)
												}
											/>
										</CardHeader>
									</View>
									<View>
										<CardHeader className="flex flex-row items-center justify-between">
											<Text className="font-semibold text-destructive-foreground">Remove card</Text>

											<Button variant={'destructive'} onPress={() => setConfirmDelete(true)}>
												<Text className="text-destructive-foreground"> Remove</Text>
											</Button>
										</CardHeader>
									</View>
								</Animated.View>
							)}
							{confirmDelete && (
								<Animated.View entering={SlideInDown} exiting={SlideOutDown} className="gap-4">
									<View>
										<CardHeader className="flex items-center justify-center">
											<H4 className="font-semibold text-destructive-foreground">Are you sure?</H4>
											<Text className="text-center font-semibold text-muted-foreground">
												You are about to delete your card that ends with {selectedCard.card.last_4_digits}, This action
												can&apos;t be undone.
											</Text>
										</CardHeader>
									</View>
									<View>
										<CardHeader className="flex flex-row items-center justify-center gap-5">
											<Button
												variant={'destructive'}
												onPress={() => {
													handleDelete(selectedCard.token);
													setConfirmDelete(false);
												}}
											>
												<Text className="text-destructive-foreground">Remove</Text>
											</Button>
											<Button
												variant={'secondary'}
												onPress={() => {
													setConfirmDelete(false);
												}}
											>
												<Text className="text-secondary-foreground">Cancel</Text>
											</Button>
										</CardHeader>
									</View>
								</Animated.View>
							)}
						</>
					)}
				</BottomSheetView>
			</BottomSheetModal>
		</SafeAreaView>
	);
}
