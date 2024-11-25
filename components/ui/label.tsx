import { Root, Text, type TextProps, type TextRef } from '@rn-primitives/label';
import { forwardRef } from 'react';
import { cn } from '~/lib/utils';

const Label = forwardRef<TextRef, TextProps>(
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
					'font-medium native:text-base text-foreground text-sm leading-none web:peer-disabled:cursor-not-allowed web:peer-disabled:opacity-70',
					className,
				)}
				{...props}
			/>
		</Root>
	),
);

export { Label };
