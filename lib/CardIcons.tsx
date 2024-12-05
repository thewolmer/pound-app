import React from 'react';
import { FontAwesome5 } from '@expo/vector-icons';

// FIX: Find a way to make it work in dark mode
export const getCardIcon = (cardType: string) => {
	switch (cardType.toLowerCase()) {
		case 'visa':
			return <FontAwesome5 name="cc-visa" size={24} color="#1a1a1a" />;
		case 'mastercard':
			return <FontAwesome5 name="cc-mastercard" size={24} color="#1a1a1a" />;
		case 'american-express':
			return <FontAwesome5 name="cc-amex" size={24} color="#1a1a1a" />;
		case 'diners-club':
			return <FontAwesome5 name="cc-diners-club" size={24} color="#1a1a1a" />;
		case 'discover':
			return <FontAwesome5 name="cc-discover" size={24} color="#1a1a1a" />;
		case 'jcb':
			return <FontAwesome5 name="cc-jcb" size={24} color="#1a1a1a" />;
		case 'unionpay':
		case 'maestro':
		case 'mir':
		case 'elo':
		case 'hiper':
		case 'hipercard':
			return <FontAwesome5 name="credit-card" size={24} color="#1a1a1a" />;
		default:
			return <FontAwesome5 name="credit-card" size={24} color="#1a1a1a" />;
	}
};
