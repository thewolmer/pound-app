export const formatCurrency = (amount: number) => {
	return new Intl.NumberFormat('en-GB', {
		style: 'currency',
		currency: 'GBP',
	}).format(amount);
};
export const parseCurrency = (value: string): string => {
	if (value === '') {
		return ''; // Untouched/default state
	}

	// Match numbers with up to two decimal places
	const formattedValue = value.match(/^\d+(\.\d{0,2})?$/);

	if (formattedValue) {
		return formattedValue[0];
	}

	// Discard invalid input and return the valid part
	const validPart = value.replace(/[^0-9.]/g, '').split('.');
	if (validPart.length > 1) {
		return `${validPart[0]}.${validPart[1].slice(0, 2)}`;
	}

	return validPart[0];
};
