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
import { ActivityIndicator, Text, View } from 'react-native';

import { cn } from '~/lib/utils';

import { Button } from './button';

interface ModalProps extends Partial<BottomSheetModalProps> {
	children?: React.ReactNode;
	title?: string;
	description?: string;
	className?: string;
	type?: 'default' | 'destructive' | 'confirm' | 'info';
	options?: {
		primaryAction?: () => void;
		secondaryAction?: () => void;
		primaryBtnText?: string;
		secondaryBtnText?: string;
		disabled?: boolean;
		loading?: boolean;
	};
}

const ModalComponent = forwardRef<BottomSheetModal, ModalProps>(
	({ children, title, description, type = 'default', options, className, snapPoints, ...props }, ref) => {
		const { dismiss } = useBottomSheetModal();

		const defaultSnapPoint = type !== 'default' ? ['30%'] : ['80%'];

		const renderBackDrop = useCallback(
			(backdropProps: BottomSheetBackdropProps) => (
				<BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...backdropProps} />
			),
			[]
		);

		return (
			<BottomSheetModal
				ref={ref}
				snapPoints={snapPoints ?? defaultSnapPoint}
				backdropComponent={renderBackDrop}
				enablePanDownToClose={props.enablePanDownToClose ?? true}
				enableDismissOnClose={true}
				animateOnMount
				enableOverDrag={props.enableOverDrag ?? false}
				handleIndicatorStyle={props.handleIndicatorStyle ?? { backgroundColor: '#fff' }}
				backgroundStyle={props.backgroundStyle ?? { backgroundColor: 'transparent' }}
				{...props}
			>
				<BottomSheetView style={{ flex: 1 }} className="rounded-t-2xl bg-card">
					{title && (
						<View className="relative flex flex-col items-center justify-center rounded-t-2xl border-b-2 border-border pb-2 pt-5">
							<Button variant={'link'} size={'icon'} onPress={() => dismiss()} className="absolute left-1 top-3.5">
								<Ionicons size={20} name="close-circle-outline" className="text-foreground" />
							</Button>
							<Text
								className={cn(
									'font-heading text-lg text-foreground',
									type === 'destructive' && 'text-destructive-foreground'
								)}
							>
								{title}
							</Text>
							{description && (
								<Text
									className={cn(
										'"text-balance text-muted-foreground" px-10 text-center font-body text-sm',
										type === 'destructive' && 'text-destructive-foreground'
									)}
								>
									{description}
								</Text>
							)}
						</View>
					)}
					<View className={cn('flex-1 gap-2 px-5 py-3', className)}>
						{children}
						{type !== 'default' && (
							<View className="gap-3">
								<Button
									variant={type === 'destructive' ? 'destructive' : 'default'}
									disabled={options?.disabled}
									onPress={() => {
										options?.primaryAction && options.primaryAction();
										dismiss();
									}}
								>
									<Text
										className={cn(
											'font-heading text-primary-foreground',
											type === 'destructive' && 'text-destructive-foreground'
										)}
									>
										{options?.loading ? <ActivityIndicator color={'white'} /> : options?.primaryBtnText || 'Primary'}
									</Text>
								</Button>
								<Button
									variant="outline"
									disabled={options?.disabled}
									onPress={() => {
										options?.secondaryAction && options.secondaryAction();
										dismiss();
									}}
								>
									<Text className="font-heading text-foreground">{options?.secondaryBtnText || 'Cancel'}</Text>
								</Button>
							</View>
						)}
					</View>
				</BottomSheetView>
			</BottomSheetModal>
		);
	}
);

ModalComponent.displayName = 'Modal';

export const Modal = ModalComponent;
