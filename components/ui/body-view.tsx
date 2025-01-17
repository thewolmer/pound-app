import React from 'react';
import { Platform, ScrollViewProps, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

interface BodyViewProps {
	children: React.ReactNode;
	scrollable?: boolean;
	ScrollViewProps?: ScrollViewProps;
	SafeAreaViewProps?: React.ComponentProps<typeof SafeAreaView>;
	className?: React.ComponentProps<typeof View>['className'];
}

export const BodyView = ({
	children,
	scrollable = true,
	className,
	ScrollViewProps,
	SafeAreaViewProps,
}: BodyViewProps) => {
	if (scrollable) {
		return (
			<>
				{Platform.OS === 'ios' ? (
					<ScrollView
						automaticallyAdjustContentInsets
						contentInsetAdjustmentBehavior="automatic"
						contentInset={{ bottom: 0 }}
						scrollIndicatorInsets={{ bottom: 0 }}
						keyboardDismissMode={ScrollViewProps?.keyboardDismissMode ?? 'on-drag'}
						{...ScrollViewProps}
					>
						<View {...SafeAreaViewProps} className={className}>
							{children}
						</View>
					</ScrollView>
				) : (
					<SafeAreaView style={{ flex: 1 }} {...SafeAreaViewProps}>
						<ScrollView
							automaticallyAdjustContentInsets
							contentInsetAdjustmentBehavior="automatic"
							contentInset={{ bottom: 0 }}
							style={{ flex: 1 }}
							scrollIndicatorInsets={{ bottom: 0 }}
							keyboardDismissMode={ScrollViewProps?.keyboardDismissMode ?? 'on-drag'}
							{...ScrollViewProps}
							className={className}
						>
							{children}
						</ScrollView>
					</SafeAreaView>
				)}
			</>
		);
	} else {
		return (
			<SafeAreaView style={{ flex: 1 }} {...SafeAreaViewProps} className={className}>
				{children}
			</SafeAreaView>
		);
	}
};
