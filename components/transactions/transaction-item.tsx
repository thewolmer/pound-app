import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import React, { type ComponentProps } from 'react';
import { Text, View } from 'react-native';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { useAccount } from '~/context/AccountContext';
import { formatCurrency } from '~/lib/formatCurrency';
import { cn, formatTransactionDate } from '~/lib/utils';
import type { Tables } from '~/types/database.types';

function getInitials(name: string | null) {
	if (!name) return 'IMG';
	return name
		.split(' ')
		.map((word) => word[0])
		.join('')
		.toUpperCase()
		.slice(0, 2);
}

export function TransactionItem({
	item,
	onlyShowTime = false,
}: { item: Tables<'account_transactions'>; onlyShowTime?: boolean }) {
	const { accountId } = useAccount();

	let accountDetails: {
		icon: ComponentProps<typeof Ionicons>['name'];
		displayName: string | null;
		avatarUrl: string | null;
	} = {
		icon: 'person-outline',
		displayName: '',
		avatarUrl: '',
	};

	if (item.type === 'deposit') {
		accountDetails = {
			icon: 'business-outline',
			displayName: 'Bank Deposit',
			avatarUrl: 'https://d2q79iu7y748jz.cloudfront.net/s/_squarelogo/256x256/0bf98c1639be507e9d352dbcd046efca', // TODO: Add actual logo
		};
	}

	if (item.type === 'transfer') {
		if (item.destination_account_id === accountId) {
			accountDetails = {
				icon: 'arrow-back-sharp',
				displayName: item.origin_display_name,
				avatarUrl: item.origin_avatar_url,
			};
		} else {
			accountDetails = {
				icon: 'arrow-forward-sharp',
				displayName: item.destination_display_name,
				avatarUrl: item.destination_avatar_url,
			};
		}
	}

	return (
		<View className="flex-row items-center justify-between border-border border-b p-2">
			<View className="flex-row items-center gap-4">
				<View className="relative h-12 w-12">
					<Avatar alt={accountDetails.displayName || ''} className="h-12 w-12 bg-muted">
						<AvatarImage source={{ uri: accountDetails.avatarUrl || undefined }} />
						<AvatarFallback>
							<Text className="text-foreground">{getInitials(accountDetails.displayName || '')}</Text>
						</AvatarFallback>
					</Avatar>
					<View className="absolute right-0 bottom-0 h-4 w-4 items-center justify-center rounded-full bg-primary">
						<Ionicons name={accountDetails.icon} size={10} className="text-primary-foreground" />
					</View>
				</View>

				<View>
					<Text className="font-bold text-foreground text-md">{accountDetails.displayName}</Text>
					{onlyShowTime ? (
						<Text className="text-muted-foreground text-sm">{format(new Date(item.created_at || ''), 'h:mm a')}</Text>
					) : (
						<Text className="text-muted-foreground text-sm">{formatTransactionDate(item.created_at || '')}</Text>
					)}
				</View>
			</View>
			<Text
				className={cn(
					item.destination_account_id === accountId ? 'text-success-foreground' : 'text-destructive-foreground',
					'font-semibold',
				)}
			>
				{item.destination_account_id === accountId ? '+' : '-'}
				{formatCurrency(item.amount || 0)}
			</Text>
		</View>
	);
}
