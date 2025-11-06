export type Employee = Record<string, any>;

export type LoggedInUser = {
	username: string;
	full_name: string;
	email: string;
	employee?: Employee;
};