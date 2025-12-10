export type Employee = Record<string, any>;

export type LoggedInUser = {
	showroom: Showroom;
	username: string;
	full_name: string;
	email: string;
	employee?: Employee;
	roles: string[];
	epc_setting: EPCSetting;
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
	epc_type: string;
	employee_name: string;
	expires_in: number;
	message: string;
};

export type Showroom = {
	name: string;
	showroom_name: string;
	sbu: string;
};

export type EPCSetting = {
	cashier_timeout: string;
	qr_timeout: string;
}

export type TransactionRequest = {
	qr_value: string;
	amount: number;
	showroom: string;
	title: string;
	description?: string;
	from_amount?: number;
	to_amount?: number;
};

export type TransactionResponse = {
	success: boolean;
	transaction_id: string;
	card_id: string;
	employee_name: string;
	amount: number;
	from_amount: number;
	to_amount: number;
	current_balance: number;
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
	epc_type: string;
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

export type QRValidationCardInfo = {
	card_id: string;
	employee: string;
	employee_name: string;
	epc_type: string;
	current_balance: number;
	current_limit: number;
	valid_from: string;
	valid_upto: string;
	discount_percentage: number;
};

export type QRValidationEmployeeInfo = {
	employee: string;
	name: string;
	department: string | null;
	designation: string | null;
	email: string;
	date_of_joining: string;
};

export type QRValidationResponse = {
	valid: boolean;
	card_info: QRValidationCardInfo;
	employee_info: QRValidationEmployeeInfo;
	cashier_timeout: number;
};

export type TransactionCountByEPCType = {
	name: string;
	count: number;
};

export type TransactionHistoryResponse = {
	transactions: TransactionListItem[];
	transaction_count_by_epc_type: TransactionCountByEPCType[];
};

export type NewsResponse = {
	name: string;
	title: string;
	short_description: string;
	description: string;
	thumbnail: string;
};

export type EPCType = {
	name: string;
	default_limit: number;
	discount: []
}

export type EPCTypeDiscount = {
	sbu: string;
	discount_percentage: number;
};