import React, { useCallback, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useAtom } from 'jotai/react';
import { Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, {
	FadeInDown,
	FadeOutDown,
	SlideInDown,
	SlideInLeft,
	SlideInRight,
	SlideOutDown,
	SlideOutLeft,
	SlideOutRight,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card as CardType } from '~/api/deposit/card.types';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardFooter, CardHeader } from '~/components/ui/card';
import { Switch } from '~/components/ui/switch';
import { H4 } from '~/components/ui/typography';
import { defaultCardAtom } from '~/lib/atoms';
import { getCardIcon } from '~/lib/CardIcons';
import { useDeleteCard } from '~/lib/pound/use-delete.card';
import { useListCards } from '~/lib/pound/use-list-cards';
import { cn } from '~/lib/utils';

export default function ManageCards() {
	const menu = useRef<BottomSheetModal>(null);
	const [selectedCard, setSelectedCard] = React.useState<CardType | null>(null);
	const [defaultCard, setDefaultCard] = useAtom(defaultCardAtom);

	const { data: cards } = useListCards();
	const { mutate: deleteCard } = useDeleteCard();
	const [confirmDelete, setConfirmDelete] = React.useState(false);
	const handleDelete = (tokenId: string) => {
		deleteCard(tokenId, {
			onSuccess: () => {
				menu.current?.close();
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
	return (
		<SafeAreaView className="flex-1">
			<ScrollView contentContainerStyle={{ padding: 16 }} contentInsetAdjustmentBehavior="automatic">
				<View className="flex flex-col gap-4">
					{cards?.map((card) => (
						<Card key={card.token} className="border-border">
							<CardHeader>
								<View className="flex-row items-center justify-between">
									<View className="flex-row items-center">
										{getCardIcon(card.card.type)}
										<Text className="ml-2 font-semibold text-foreground">XXXX {card.card.last_4_digits}</Text>
									</View>
									<Button
										variant="link"
										size={'icon'}
										onPress={() => {
											setSelectedCard(card);
											menu.current?.present();
										}}
									>
										<Ionicons name="ellipsis-horizontal" size={24} className="text-foreground" />
									</Button>
								</View>
							</CardHeader>
							<CardFooter>
								<View className="flex-row items-center justify-between">
									{defaultCard && defaultCard.token === card.token && (
										<Badge variant={'outline'} className="bg-success">
											<Text className="text-xs font-semibold capitalize text-success-foreground">Primary</Text>
										</Badge>
									)}
								</View>
							</CardFooter>
						</Card>
					))}
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
											<Text className="font-semibold">
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
