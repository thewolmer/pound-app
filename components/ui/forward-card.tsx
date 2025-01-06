import { Ionicons } from '@expo/vector-icons';
import type React from 'react';
import { Pressable, Text, View } from 'react-native';

import { useHaptics } from '~/lib/useHaptics';
import { cn } from '~/lib/utils';

import { Button } from './button';
import { Card, CardFooter, CardHeader } from './card';
import { IconWrapper } from './icon-wrapper';

type IoniconsName = keyof (typeof Ionicons)['glyphMap'];

type ForwardCardProps = {
	children?: React.ReactNode;
	title: string;
	description: string;
	ionicons?: IoniconsName;
	IconLeft?: React.ReactNode;
	IconRight?: React.ReactNode;
	onPress?: () => void;
	titleClassName?: string;
	descriptionClassName?: string;
};

export const ForwardCard: React.FC<ForwardCardProps> = ({
	title,
	description,
	ionicons,
	IconLeft,
	IconRight,
	onPress,
	titleClassName,
	descriptionClassName,
}) => {
	const { triggerHaptics } = useHaptics();
	return (
		<Pressable
			onPress={() => {
				triggerHaptics('impact-light');
				onPress?.();
			}}
		>
			<Card className="mb-3 flex w-full flex-row items-center justify-between px-3 shadow-sm">
				<View className="flex w-[85%] flex-row items-center">
					{ionicons && (
						<IconWrapper>
							<Ionicons name={ionicons} size={38} className="text-foreground" />
						</IconWrapper>
					)}
					{IconLeft && !ionicons && <>{IconLeft}</>}
					<View>
						<CardHeader className="pb-0">
							<Text className={cn(titleClassName, 'text-lg font-bold text-card-foreground')}>{title}</Text>
						</CardHeader>
						<CardFooter>
							<Text className={cn('w-[95%] truncate text-balance text-sm text-muted-foreground', descriptionClassName)}>
								{description}
							</Text>
						</CardFooter>
					</View>
				</View>
				<Button
					variant={'link'}
					onPress={() => {
						triggerHaptics('impact-light');
						onPress?.();
					}}
				>
					{IconRight ? (
						<>{IconRight}</>
					) : (
						<Ionicons name="chevron-forward-outline" size={24} className="text-foreground" />
					)}
				</Button>
			</Card>
		</Pressable>
	);
};
