import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { useHaptics } from '~/lib/useHaptics';

interface NumberPadProps {
	title: string;
	onClose: () => void;
	onSubmit: (amount: number) => void;
}

export function NumberPad({ title, onClose, onSubmit }: NumberPadProps) {
	const [amount, setAmount] = useState('');
	const { triggerHaptics } = useHaptics();
	const addDigit = (digit: string) => {
		if (digit === '.' && amount.includes('.')) return;
		if (digit === '.' && !amount) {
			setAmount('0.');
			return;
		}
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

	const handleSubmit = () => {
		const sanitizedAmount = Number(amount);
		onSubmit(sanitizedAmount || 0);
	};
	return (
		<View className="bg-transparent p-4">
			<View className="mb-4 items-center">
				<Text className="text-2xl text-muted-foreground">{title}</Text>
				<Text className="mt-2 font-bold text-3xl">£{amount || '0'}</Text>
			</View>

			<View className="flex h-[40vh] flex-row flex-wrap justify-between gap-y-4">
				{['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'].map((key) => (
					<Pressable
						key={key}
						onPressIn={() => triggerHaptics('impact-light')}
						className="flex h-[20%] w-[30%] items-center justify-center rounded-xl border border-accent"
						onPress={() => {
							if (key === '⌫') setAmount((prev) => prev.slice(0, -1));
							else addDigit(key);
						}}
					>
						<Text className="text-2xl">{key}</Text>
					</Pressable>
				))}
			</View>

			<View className="mt-4 flex-row gap-4">
				<Button variant="outline" className="flex-1" onPress={onClose}>
					<Text>Cancel</Text>
				</Button>
				<Button className="flex-1" variant={'secondary'} onPress={handleSubmit}>
					<Text>OK</Text>
				</Button>
			</View>
		</View>
	);
}
