import { forwardRef } from 'react';
import { Root, Text, TextProps, TextRef } from '@rn-primitives/label';

import { cn } from '~/lib/utils';

export const Label = forwardRef<TextRef, TextProps>(
	({ className, onPress, onLongPress, onPressIn, onPressOut, ...props }, ref) => (
		<Root
			className="web:cursor-default"
			onPress={onPress}
			onLongPress={onLongPress}
			onPressIn={onPressIn}
			onPressOut={onPressOut}
		>
			<Text
				ref={ref}
				className={cn(
					'native:text-base text-sm font-medium leading-none text-foreground web:peer-disabled:cursor-not-allowed web:peer-disabled:opacity-70',
					className
				)}
				{...props}
			/>
		</Root>
	)
);

Label.displayName = 'Label';
