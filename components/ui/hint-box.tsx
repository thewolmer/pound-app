import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { cn } from '~/lib/utils';

type HintBoxProps = React.ComponentProps<typeof View> & {
	text: string;
	when: boolean;
};

export function HintBox({ text, when, className, ...rest }: HintBoxProps) {
	if (!when) return null;

	return (
		<View {...rest} className={cn('flex flex-row items-center gap-2 rounded-lg bg-info p-2', className)}>
			<Ionicons name="information-circle" size={24} className="text-info-foreground" />
			<View className="flex-1">
				<Text className="text-xs text-info-foreground">{text}</Text>
			</View>
		</View>
	);
}
