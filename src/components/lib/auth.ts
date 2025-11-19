import { reactive, readonly } from 'vue';
import { frappe } from './frappe';
import { getCookie } from './utils';
import { Employee, LoggedInUser } from './types';
import { initSocket } from './frappeSocket';

const ROLES_STORAGE_KEY = 'user_roles';

// localStorage helper functions
function saveRolesToStorage(roles: string[]): void {
	try {
		localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(roles));
	} catch (error) {
		console.error('Failed to save roles to localStorage:', error);
	}
}

function loadRolesFromStorage(): string[] {
	try {
		const stored = localStorage.getItem(ROLES_STORAGE_KEY);
		return stored ? JSON.parse(stored) : [];
	} catch (error) {
		console.error('Failed to load roles from localStorage:', error);
		return [];
	}
}

function clearRolesFromStorage(): void {
	try {
		localStorage.removeItem(ROLES_STORAGE_KEY);
	} catch (error) {
		console.error('Failed to clear roles from localStorage:', error);
	}
}

const state = reactive<{
	isLoading: boolean;
	isFetchingUser: boolean;
	isAuthenticated: boolean;
	user: LoggedInUser | null;
	roles: string[];
}>({
	isLoading: false,
	isFetchingUser: false,
	isAuthenticated: false,
	user: null,
	roles: [],
});

async function fetchLoggedInUser(): Promise<LoggedInUser | null> {
	// Skip if clearly guest
	const userId = getCookie('user_id');
	if (!userId || userId === 'Guest') {
		state.isAuthenticated = false;
		state.user = null;
		state.roles = [];
		clearRolesFromStorage();
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
		state.roles = res?.message?.roles ?? [];
		// Save roles to localStorage for instant access
		saveRolesToStorage(state.roles);
		initSocket();
		return state.user;
	} catch (error) {
		state.user = null;
		state.isAuthenticated = false;
		state.roles = [];
		clearRolesFromStorage();
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
		clearRolesFromStorage();
		window.location.reload();
	} finally {
		state.user = null;
		state.isAuthenticated = false;
		state.roles = [];
		state.isLoading = false;
	}
}

// Call on app start to hydrate state from session/cookies
async function initAuth(): Promise<void> {
	// Load roles from localStorage first (synchronous, instant)
	state.roles = loadRolesFromStorage();
	state.isFetchingUser = true;
	// Then fetch fresh data from API in background
	await fetchLoggedInUser();
	state.isFetchingUser = false;
}

function userHomePage(): string {
	if (state.roles.includes('Employee')) {
		return '/';
	} else if (state.roles.includes('Cashier')) {
		return '/cashier';
	} else {
		return '/forbidden';
	}
}

export function useAuth() {
	return {
		isFetchingUser: state.isFetchingUser,
		state: readonly(state),
		login,
		logout,
		fetchLoggedInUser,
		initAuth,
		userHomePage,
	};
}


