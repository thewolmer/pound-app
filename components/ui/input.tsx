import * as React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TextInput, View } from 'react-native';

import { cn } from '~/lib/utils';

interface InputProps extends React.ComponentPropsWithoutRef<typeof TextInput> {
	leftIcon?: React.ComponentProps<typeof Ionicons>['name']; // Optional leftIcon prop
}

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
	({ className, placeholderClassName, leftIcon, ...props }, ref) => {
		if (!leftIcon) {
			return (
				<TextInput
					ref={ref}
					className={cn(
						'native:h-12 native:text-lg native:leading-[1.25] h-10 h-12 w-full rounded-xl border border-input bg-card px-3 text-base text-foreground placeholder:text-muted-foreground/50 focus:outline-none lg:text-sm',
						className
					)}
					placeholderClassName={cn('text-muted-foreground', placeholderClassName)}
					{...props}
				/>
			);
		}
		return (
			<View className="relative h-12 flex-1 rounded-xl border border-input bg-card px-3">
				{leftIcon && (
					<View className="absolute left-3 top-1/2 -translate-y-1/2">
						<Ionicons name={leftIcon} size={20} className="text-muted-foreground" />
					</View>
				)}
				<TextInput
					ref={ref}
					style={{
						paddingLeft: leftIcon ? 30 : undefined,
					}}
					className={cn(
						'native:h-12 native:text-lg native:leading-[1.25] h-10 w-full text-base text-foreground placeholder:text-muted-foreground/50 focus:outline-none lg:text-sm',
						className
					)}
					placeholderClassName={cn('text-muted-foreground', placeholderClassName)}
					{...props}
				/>
			</View>
		);
	}
);

Input.displayName = 'Input';

export { Input };
