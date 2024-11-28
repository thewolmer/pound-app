import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { decode } from 'base64-arraybuffer';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { UserDetailsForm } from '~/components/forms/user-details';
import { useSession } from '~/context/SessionContext';
import { supabase } from '~/lib/supabase';

const User = () => {
	const { person, updatePerson } = useSession();

	const [isUploading, setIsUploading] = useState(false);

	const handleUploadAvatar = async () => {
		try {
			setIsUploading(true);

			// Request image from the library
			const result = await launchImageLibraryAsync({
				mediaTypes: ['images'],
				allowsEditing: true,
				aspect: [1, 1],
				quality: 1,
			});

			if (!result.canceled) {
				const img = result.assets[0];

				const resizedImageRef = await ImageManipulator.manipulate(img.uri)
					.resize({ width: 200, height: 200 })
					.renderAsync();
				const resizedImage = await resizedImageRef.saveAsync({ format: SaveFormat.JPEG, base64: true, compress: 1 });

				// Upload to Supabase Storage using file URI
				const newAvatarFileName = `${person?.id}-${Date.now()}.jpg`;
				const { error: uploadError } = await supabase.storage
					.from('avatar')
					.upload(newAvatarFileName, decode(resizedImage.base64 as string), {
						contentType: 'image/jpeg',
					});

				if (uploadError) {
					console.error(uploadError);
					throw new Error('Failed to upload avatar', uploadError);
				}

				// Get the public URL for the uploaded avatar
				const { data: publicUrlData } = await supabase.storage.from('avatar').getPublicUrl(newAvatarFileName);

				const avatarUrl = publicUrlData?.publicUrl;
				if (!avatarUrl) {
					console.error('Failed to retrieve avatar URL');
					throw new Error('Failed to retrieve avatar URL');
				}

				const oldAvatarFileName = person?.avatar_url?.split('/').pop();

				if (oldAvatarFileName) {
					await supabase.storage.from('avatar').remove([oldAvatarFileName]);
				}

				await updatePerson({ avatar_url: avatarUrl });

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
						{!person && (
							<View className="flex h-40 w-40 items-center justify-center rounded-full bg-accent text-center">
								<ActivityIndicator size={'large'} className="absolute" color="white" />
							</View>
						)}
						{person?.avatar_url && <Image source={{ uri: person.avatar_url }} className="h-40 w-40 rounded-full" />}
						{person?.first_name && !person?.avatar_url && (
							<View className="flex h-40 w-40 items-center justify-center rounded-full bg-accent text-center">
								<Text className="text-6xl text-accent-foreground">{person?.first_name[0]}</Text>
							</View>
						)}

						{isUploading && <ActivityIndicator size={'large'} className="absolute" color="white" />}
						<View className="absolute bottom-0 right-0 rounded-full bg-secondary p-2 shadow">
							<Ionicons name="create-outline" size={24} className="text-secondary-foreground" />
						</View>
					</Pressable>
				</View>

				<UserDetailsForm />
			</ScrollView>
		</SafeAreaView>
	);
};

export default User;
