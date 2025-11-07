export type Employee = Record<string, any>;

export type LoggedInUser = {
	username: string;
	full_name: string;
	email: string;
	employee?: Employee;
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