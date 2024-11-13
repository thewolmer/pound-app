import { type ClassValue, clsx } from 'clsx';
import { format, isDate, isToday, isYesterday } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function uuid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

export function formatTransactionDate(date: Date | string): string {
	let d: Date;
	if (typeof date === 'string') {
		d = new Date(date);
	} else {
		d = date;
	}
	if (!isDate(d)) return 'invalid date';
	const time = format(d, 'h:mm a');
	if (isToday(d)) return `Today, ${time}`;
	if (isYesterday(d)) return `Yesterday, ${time}`;
	return format(d, 'MMM d, yyyy h:mm a');
}
