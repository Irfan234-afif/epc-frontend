export type Employee = Record<string, any>;

export type LoggedInUser = {
	username: string;
	full_name: string;
	email: string;
	employee?: Employee;
	roles: string[];
};

export type UserCardResponse = {
	name: string;
	employee: string;
	employee_name: string;
	epc_type: string;
	current_limit: number;
	current_balance: number;
	valid_from: string | null;
	valid_upto: string | null;
	days_remaining: number | null;
	logo: string;
	color: string;
};

export type QRCodeResponse = {
	success: boolean;
	qr_code: string;
	card_name: string;
	employee_name: string;
	expires_in: number;
	message: string;
};

export type Showroom = {
	name: string;
	showroom_name: string;
	sbu: string;
};

export type TransactionRequest = {
	qr_value: string;
	amount: number;
	showroom: string;
	title: string;
	description?: string;
};

export type TransactionResponse = {
	success: boolean;
	transaction_id: string;
	card_id: string;
	employee_name: string;
	amount: number;
	from_balance: number;
	to_balance: number;
	message: string;
};

export type Transaction = {
	name: string;
	epc_card: string;
	employee_name: string;
	total_amount: number;
	from_balance: number;
	to_balance: number;
};

export type TransactionListItem = {
	name: string;
	epc_card: string;
	employee_name: string;
	title: string;
	total_amount: number;
	description: string | null;
	showroom: string;
	showroom_name: string;
	sbu: string;
	sbu_logo: string;
	date: string;
	posting_time: string;
	from_balance: number;
	to_balance: number;
};