export interface CreateCardProps {
	card: {
		cvv: string;
		expiry_month: string;
		expiry_year: string;
		last_4_digits: string;
		name: string;
		number: string;
		type: string;
	};
	reference: string;
	redirectUrl: string;
}

export interface Card {
	active: boolean;
	card: {
		last_4_digits: string;
		type: string;
	};
	created_at: string;
	mandate: {
		merchant_code: string;
		status: string;
		type: string;
	};
	token: string;
	type: string;
}
