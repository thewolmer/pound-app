import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { useSession } from '~/context/SessionContext';
import { useDebounce } from '~/hooks/useDebounce';
import { supabase } from '~/lib/supabase';

const tagSchema = z
	.string()
	.regex(/^[a-z0-9]+$/, 'Tag can only contain lowercase letters and numbers')
	.min(3, 'Tag must be at least 3 characters long')
	.max(15, 'Tag can be up to 15 characters');

export default function UpdateTag() {
	const [tag, setTag] = useState('');
	const [isAvailable, setIsAvailable] = useState(true);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [initialTag, setInitialTag] = useState<string | null>(null);
	const debouncedTag = useDebounce(tag, 300);
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const [user, setUser] = useState<any | null>(null);

	const { session } = useSession();

	useEffect(() => {
		const fetchData = async () => {
			const { data, error } = await supabase.from('person').select('identity_tag').eq('id', session?.user.id);
			if (data?.[0]?.identity_tag) {
				setUser(data[0]);
				setInitialTag(data[0].identity_tag);
				setTag(data[0].identity_tag);
			}
			if (error) {
				alert('Something went wrong');
			}
		};

		fetchData();
	}, [session?.user.id]);

	const validateTag = (input: string) => {
		const result = tagSchema.safeParse(input);
		if (!result.success) {
			setError(result.error.errors[0].message);
		} else {
			setError('');
		}
	};

	useEffect(() => {
		const checkTagAvailability = async () => {
			if (debouncedTag) {
				const { data } = await supabase.from('person').select('identity_tag').eq('identity_tag', debouncedTag);
				setIsAvailable(data?.length === 0);
			}
		};
		checkTagAvailability();
	}, [debouncedTag]);

	const handleTagChange = (input: string) => {
		setTag(input);
		validateTag(input);
	};

	const handleSubmit = async () => {
		if (error || !isAvailable) return;
		setLoading(true);
		try {
			await supabase.from('person').update({ identity_tag: tag }).eq('id', session?.user.id);
			router.back();
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	if (user === null) {
		return (
			<View className="flex-1 items-center justify-center">
				<ActivityIndicator size="large" />
			</View>
		);
	}

	return (
		<SafeAreaView className="w-full flex-1 ">
			<ScrollView contentInsetAdjustmentBehavior="automatic" className="flex w-full flex-1 p-6">
				<View className="mb-10 flex flex-1">
					<Text className="mb-4 text-foreground text-lg">
						{initialTag
							? `Your Pound Tag is @${initialTag},\nYou can change it here if you want`
							: 'Pound tag is used to send you money,\nAdd a New Tag'}
					</Text>
					<Input
						value={tag}
						onChangeText={handleTagChange}
						returnKeyType="done"
						placeholder="Enter your pound tag"
						autoFocus
						onSubmitEditing={handleSubmit}
					/>
					{tag && !error && tag !== initialTag ? (
						!isAvailable && !error ? (
							<Text className="mt-2 text-destructive">Tag is already taken</Text>
						) : (
							<Text className="mt-2 text-green-500">Tag is available</Text>
						)
					) : null}
					{error && <Text className="mt-2 text-destructive">{error}</Text>}
				</View>
				<Button onPress={handleSubmit} disabled={loading || !!error || !isAvailable || initialTag === tag}>
					{initialTag ? (
						<Text className="text-white">{loading ? 'Updating...' : 'Update'}</Text>
					) : (
						<Text className="text-white">{loading ? 'Adding...' : 'Add'}</Text>
					)}
				</Button>
			</ScrollView>
		</SafeAreaView>
	);
}
