import { Text } from '~/components/ui/text';
import { H1 } from '~/components/ui/typography';
import { useAccount } from '~/context/AccountContext';
import { formatCurrency } from '~/lib/formatCurrency';
import { Card, CardFooter, CardHeader } from '../ui/card';
import DepositButton from './DepositButton';
import RequestButton from './RequestButton';
import SendButton from './SendButton';

export function AccountBalance() {
	const { balance } = useAccount();

	return (
		<>
			<Card>
				<CardHeader className="items-center">
					<Text className="mb-2 text-accent-foreground">Available Balance</Text>
					<H1>{formatCurrency(Number(balance))}</H1>
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
