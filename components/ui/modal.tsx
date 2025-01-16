import React, { forwardRef, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
	BottomSheetBackdrop,
	BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetModalProps,
	BottomSheetView,
	useBottomSheetModal,
} from '@gorhom/bottom-sheet';
import { Text, View } from 'react-native';

import { useHaptics } from '~/lib/use-haptics';
import { cn } from '~/lib/utils';

import { Button } from './button';

interface ModalProps extends Partial<BottomSheetModalProps> {
	children: React.ReactNode;
	title?: string;
	description?: string;
	className?: string;
}

const ModalComponent = forwardRef<BottomSheetModal, ModalProps>(
	({ children, title, description, className, snapPoints = ['80%'], backdropComponent, ...props }, ref) => {
		const renderBackDrop = useCallback(
			(backdropProps: BottomSheetBackdropProps) => (
				<BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...backdropProps} />
			),
			[]
		);
		const { triggerHaptics } = useHaptics();
		const { dismiss } = useBottomSheetModal();
		const onDismiss = () => {
			triggerHaptics('impact-light');
			props.onDismiss && props.onDismiss();
		};

		return (
			<BottomSheetModal
				ref={ref}
				snapPoints={snapPoints}
				backdropComponent={backdropComponent ?? renderBackDrop}
				enablePanDownToClose={props.enablePanDownToClose ?? true}
				enableDismissOnClose={true}
				onDismiss={onDismiss}
				enableOverDrag={props.enableOverDrag ?? false}
				handleIndicatorStyle={props.handleIndicatorStyle ?? { backgroundColor: '#fff' }}
				backgroundStyle={props.backgroundStyle ?? { backgroundColor: 'transparent' }}
				{...props}
			>
				<BottomSheetView style={{ flex: 1 }} className="rounded-t-2xl bg-card">
					{title && (
						<View className="relative flex flex-col items-center justify-center border-b-2 border-border pb-2 pt-5">
							<Button variant={'link'} size={'icon'} onPress={() => dismiss()} className="absolute left-1 top-3.5">
								<Ionicons size={20} name="close-circle-outline" className="text-foreground" />
							</Button>
							<Text className="font-heading text-lg text-foreground">{title}</Text>
							{description && (
								<Text className="text-balance px-10 text-center font-body text-sm text-muted-foreground">
									{description}
								</Text>
							)}
						</View>
					)}
					<View className={cn('flex-1 gap-2 px-5 py-3', className)}>{children}</View>
				</BottomSheetView>
			</BottomSheetModal>
		);
	}
);

ModalComponent.displayName = 'Modal';

export const Modal = ModalComponent;
