import { useState } from 'react';
import { View } from 'react-native';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

interface NumberPadProps {
	onClose: () => void;
	onSubmit: (amount: string) => void;
}

interface NumberPadProps {
	title: string;
	onClose: () => void;
	onSubmit: (amount: string) => void;
}

export function NumberPad({ title, onClose, onSubmit }: NumberPadProps) {
	const [amount, setAmount] = useState('');

	const addDigit = (digit: string) => {
		if (digit === '.' && amount.includes('.')) return;
		if (amount.includes('.')) {
			const [whole, decimal] = amount.split('.');
			if (decimal.length >= 2) return;
		}
		if (amount === '0' && digit !== '.') {
			setAmount(digit);
			return;
		}
		setAmount((prev) => prev + digit);
	};

	return (
		<View className="rounded-t-3xl bg-background p-4">
			<View className="mb-4 items-center">
				<Text className="text-2xl">{title}</Text>
				<Text className="mt-2 font-bold text-3xl">£{amount || '0'}</Text>
			</View>

			<View className="flex-row flex-wrap justify-between gap-y-4">
				{['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'].map((key) => (
					<Button
						key={key}
						variant="ghost"
						className="w-[30%]"
						onPress={() => {
							if (key === '⌫') setAmount((prev) => prev.slice(0, -1));
							else addDigit(key);
						}}
					>
						<Text className="text-2xl">{key}</Text>
					</Button>
				))}
			</View>

			<View className="mt-4 flex-row gap-4">
				<Button variant="outline" className="flex-1" onPress={onClose}>
					<Text>Cancel</Text>
				</Button>
				<Button className="flex-1" onPress={() => onSubmit(amount)}>
					<Text>OK</Text>
				</Button>
			</View>
		</View>
	);
}
