import { Ionicons } from '@expo/vector-icons';
import {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetFlatList,
	BottomSheetModal,
	BottomSheetTextInput,
	BottomSheetView,
} from '@gorhom/bottom-sheet';
import type { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import type * as Contacts from 'expo-contacts';
import { router } from 'expo-router';
import type React from 'react';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Platform, Pressable } from 'react-native';
import { Image, Text, View } from 'react-native';
import { Button } from '~/components/ui/button';
import { Card, CardFooter, CardHeader } from '~/components/ui/card';
import { H3, H4 } from '~/components/ui/typography';
import { useSession } from '~/context/SessionContext';
import { supabase } from '~/lib/supabase';
import { cn } from '~/lib/utils';
import type { Tables } from '~/types/database.types';

export const SendViaPoundTag = () => {
	const poundTagModalRef = useRef<BottomSheetModal>(null);
	const { session } = useSession();
	const [poundTag, setPoundTag] = useState<string>('');
	const renderBackDrop = useCallback(
		(backdropProps: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...backdropProps} />
		),
		[],
	);

	const handleVerifyTag = async () => {
		const { data, error } = await supabase.from('account_details').select().eq('identity_tag', poundTag).single();
		if (!data) {
			alert(`${poundTag} is not a valid PoundTag`);
			return;
		}

		if (error) {
			alert('Something went wrong');
			return;
		}

		if (data.person_id === session?.user.id) {
			alert('You cannot send money to yourself');
			return;
		}
		poundTagModalRef.current?.close();
		router.push({ pathname: '/(send)/transfer', params: { account_details: JSON.stringify(data) } });
	};

	const openPoundTagModal = async () => {
		poundTagModalRef.current?.present();
	};

	return (
		<>
			<Card className="mb-3 flex flex-row items-center justify-between px-4">
				<View className="flex w-[85%] flex-row items-center">
					<Ionicons name="id-card" size={38} className="text-foreground" />
					<View>
						<CardHeader className="pb-0">
							<H4>Send via Pound Tag</H4>
						</CardHeader>
						<CardFooter>
							<Text className="truncate text-muted-foreground text-sm">
								Send money to someone using their pound tag.
							</Text>
						</CardFooter>
					</View>
				</View>
				<Button variant="link" onPress={openPoundTagModal}>
					<Ionicons name="chevron-forward-outline" size={24} className="text-foreground" />
				</Button>
			</Card>
			<BottomSheetModal
				backdropComponent={renderBackDrop}
				ref={poundTagModalRef}
				snapPoints={['80%']}
				enableDynamicSizing
				enableDismissOnClose
				handleIndicatorStyle={{ backgroundColor: '#fff' }}
				backgroundStyle={{ backgroundColor: 'transparent' }}
				onDismiss={() => {
					setPoundTag('');
				}}
			>
				<BottomSheetView className="flex-1 gap-5 rounded-t-2xl bg-card p-5 py-10">
					<H3>Send Via Pound tag</H3>
					<BottomSheetTextInput
						placeholder="@poundtag"
						value={poundTag}
						onChangeText={setPoundTag}
						autoCapitalize="none"
						returnKeyType="next"
						onSubmitEditing={handleVerifyTag}
						className="rounded-xl border border-border bg-muted p-2 text-foreground"
					/>
					<Button disabled={poundTag.length < 3} onPress={handleVerifyTag} className="mt-5">
						<Text className="text-white">Next</Text>
					</Button>
					{/*  */}
					<View>
						<Text className="text-center text-muted-foreground text-sm">
							TODO: a section here to explain what a pound tag is
						</Text>
					</View>
				</BottomSheetView>
			</BottomSheetModal>
		</>
	);
};
