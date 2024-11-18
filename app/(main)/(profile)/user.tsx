import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSession } from '~/context/SessionContext';
import { supabase } from '~/lib/supabase';
import type { Tables } from '~/types/database.types';

const User = () => {
	const { session } = useSession();
	if (!session) return null;

	const [user, setUser] = useState<Tables<'person'> | null>(null);
	const [isUploading, setIsUploading] = useState(false);

	useFocusEffect(
		useCallback(() => {
			const fetchData = async () => {
				if (session.user.id) {
					const { data, error } = await supabase.from('person').select().eq('id', session.user.id).single();

					if (data) {
						setUser(data);
					}
					if (error) {
						alert('Something went wrong');
						console.error(error);
					}
				}
			};

			fetchData();
		}, [session.user.id]),
	);

	const handleUploadAvatar = async () => {
		try {
			setIsUploading(true);

			// Request image from the library
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ['images'],
				allowsEditing: true,
				quality: 1,
			});

			if (!result.canceled) {
				const img = result.assets[0];

				// Resize the image
				const resizedImage = await ImageManipulator.manipulateAsync(
					img.uri,
					[{ resize: { width: 200, height: 200 } }],
					{
						compress: 1,
						format: ImageManipulator.SaveFormat.JPEG,
						base64: true,
					},
				);

				// Upload to Supabase Storage using file URI
				const fileName = `avatar-${session.user.id}.jpg`;
				const { error: uploadError } = await supabase.storage
					.from('avatar')
					.upload(`${fileName}`, resizedImage.base64 as string, {
						contentType: 'image/jpeg',
						upsert: true,
					});

				if (uploadError) {
					console.error(uploadError);
					throw new Error('Failed to upload avatar', uploadError);
				}

				// Get the public URL for the uploaded avatar
				const { data: publicUrlData } = supabase.storage.from('avatar').getPublicUrl('${fileName}');

				const avatarUrl = publicUrlData?.publicUrl;
				console.log('avatarUrl', avatarUrl);
				if (!avatarUrl) {
					console.error('Failed to retrieve avatar URL');
					throw new Error('Failed to retrieve avatar URL');
				}

				// Update the user's profile with the new avatar URL
				const { error: updateError } = await supabase
					.from('person')
					.update({ avatar_url: avatarUrl })
					.eq('id', session.user.id);

				if (updateError) {
					console.error(updateError);
					throw new Error('Failed to update user profile');
				}

				// Update local state
				setUser((prev) => (prev ? { ...prev, avatar_url: avatarUrl } : prev));
				alert('Avatar uploaded successfully');
			}
		} catch (err) {
			alert('Something went wrong');
			console.error(err);
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<SafeAreaView className="w-full flex-1">
			<ScrollView contentInsetAdjustmentBehavior="automatic" className="flex w-full flex-1 p-6 text-foreground">
				<View className="flex items-center justify-center">
					<Pressable
						onPress={handleUploadAvatar}
						className="relative flex w-40 items-center justify-center"
						disabled={isUploading}
					>
						{!user && (
							<View className="flex h-40 w-40 items-center justify-center rounded-full bg-accent text-center">
								<ActivityIndicator size={'large'} className="absolute" color="white" />
							</View>
						)}
						{user?.avatar_url && <Image source={{ uri: user.avatar_url }} className="h-40 w-40 rounded-full" />}
						{user?.first_name && !user?.avatar_url && (
							<View className="flex h-40 w-40 items-center justify-center rounded-full bg-accent text-center">
								<Text className="text-6xl text-accent-foreground">{user?.first_name[0]}</Text>
							</View>
						)}

						{isUploading && <ActivityIndicator size={'large'} className="absolute" color="white" />}
						<View className="absolute right-0 bottom-0 rounded-full bg-secondary p-2 shadow">
							<Ionicons name="create-outline" size={24} className="text-secondary-foreground" />
						</View>
					</Pressable>
				</View>

				<Text className="mt-6 text-foreground">Todo: ability to update name, phone, email, profile picture, etc</Text>
			</ScrollView>
		</SafeAreaView>
	);
};

export default User;
