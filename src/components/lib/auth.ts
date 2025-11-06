import { reactive, readonly } from 'vue';
import { frappe } from './frappe';
import { getCookie } from './utils';
import { Employee, LoggedInUser } from './types';

const state = reactive<{
	isLoading: boolean;
	isAuthenticated: boolean;
	user: LoggedInUser | null;
}>({
	isLoading: false,
	isAuthenticated: false,
	user: null,
});

async function fetchLoggedInUser(): Promise<LoggedInUser | null> {
	// Skip if clearly guest
	const userId = getCookie('user_id');
	if (!userId || userId === 'Guest') {
		state.isAuthenticated = false;
		state.user = null;
		return null;
	}

	state.isLoading = true;
	try {
		const res = await frappe
			.call()
			.get<{ message: LoggedInUser }>(
				'employeediscount.api.user.get_logged_in_user'
			);
		state.user = res?.message ?? null;
		state.isAuthenticated = !!state.user;
		return state.user;
	} catch (error) {
		state.user = null;
		state.isAuthenticated = false;
		return null;
	} finally {
		state.isLoading = false;
	}
}

async function login(username: string, password: string): Promise<boolean> {
	state.isLoading = true;
	try {
		// Username can be email or user id (Frappe supports both)
		await frappe.auth().loginWithUsernamePassword({ username, password });
		await fetchLoggedInUser();
		return state.isAuthenticated;
	} finally {
		state.isLoading = false;
	}
}

async function logout(): Promise<void> {
	state.isLoading = true;
	try {

		await frappe.auth().logout();
        window.location.reload();
	} finally {
		state.user = null;
		state.isAuthenticated = false;
		state.isLoading = false;
	}
}

// Call on app start to hydrate state from session/cookies
async function initAuth(): Promise<void> {
	await fetchLoggedInUser();
}

export function useAuth() {
	return {
		state: readonly(state),
		login,
		logout,
		fetchLoggedInUser,
		initAuth,
	};
}


