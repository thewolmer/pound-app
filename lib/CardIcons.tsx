import React from 'react';
import { FontAwesome5 } from '@expo/vector-icons';

export const getCardIcon = (cardType: string) => {
	switch (cardType.toLowerCase()) {
		case 'visa':
			return <FontAwesome5 name="cc-visa" size={24} className="text-foreground" />;
		case 'mastercard':
			return <FontAwesome5 name="cc-mastercard" size={24} className="text-foreground" />;
		case 'american-express':
			return <FontAwesome5 name="cc-amex" size={24} className="text-foreground" />;
		case 'diners-club':
			return <FontAwesome5 name="cc-diners-club" size={24} className="text-foreground" />;
		case 'discover':
			return <FontAwesome5 name="cc-discover" size={24} className="text-foreground" />;
		case 'jcb':
			return <FontAwesome5 name="cc-jcb" size={24} className="text-foreground" />;
		case 'unionpay':
		case 'maestro':
		case 'mir':
		case 'elo':
		case 'hiper':
		case 'hipercard':
			return <FontAwesome5 name="credit-card" size={24} className="text-foreground" />;
		default:
			return <FontAwesome5 name="credit-card" size={24} className="text-foreground" />;
	}
};
