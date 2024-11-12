import { useEffect, useState } from 'react';
import { Text } from '~/components/ui/text';
import { H1 } from '~/components/ui/typography';
import { useAccount } from '~/context/AccountContext';
import { formatCurrency } from '~/lib/formatCurrency';
import { Card, CardFooter, CardHeader } from '../ui/card';
import DepositButton from './DepositButton';
import RequestButton from './RequestButton';
import SendButton from './SendButton';

export function AccountBalance() {
	const { balance, isLoading } = useAccount();
	const [previousBalance, setPreviousBalance] = useState<number | null>(null);
	const [isChanged, setIsChanged] = useState(false);

	useEffect(() => {
		if (isLoading) return;
		if (previousBalance === null) {
			setPreviousBalance(balance);
			return;
		}

		if (balance !== previousBalance) {
			setIsChanged(true);

			const timer = setTimeout(() => {
				setPreviousBalance(balance);
				setIsChanged(false);
			}, 1000);

			return () => clearTimeout(timer);
		}
	}, [balance, previousBalance, isLoading]);

	const getBalanceColor = () => {
		if (!isChanged || balance === previousBalance) return '';

		return balance > (previousBalance || 0) ? 'text-success-foreground' : 'text-destructive-foreground';
	};

	return (
		<>
			<Card>
				<CardHeader className="items-center">
					<Text className="mb-2 text-accent-foreground">Available Balance</Text>
					<H1 className={getBalanceColor()}>{formatCurrency(Number(balance))}</H1>
				</CardHeader>

				<CardFooter className="flex justify-between">
					<DepositButton />
					<SendButton />
					<RequestButton />
				</CardFooter>
			</Card>
		</>
	);
}
