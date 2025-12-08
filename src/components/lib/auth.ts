import { reactive, readonly } from 'vue';
import { frappe } from './frappe';
import { getCookie } from './utils';
import { Employee, EPCSetting, LoggedInUser, Showroom } from './types';
import { initSocket } from './frappeSocket';

const ROLES_STORAGE_KEY = 'user_roles';
const SHOWROOM_STORAGE_KEY = 'showroom';
const EPC_SETTING_STORAGE_KEY = 'epc_setting';

// localStorage helper functions
function saveRolesToStorage(roles: string[]): void {
	try {
		localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(roles));
	} catch (error) {
		console.error('Failed to save roles to localStorage:', error);
	}
}

function saveToStorage(key: string, data: any): void {
	try {
		localStorage.setItem(key, JSON.stringify(data));
	} catch (error) {
		console.error('Failed to save roles to localStorage:', error);
	}
}

function loadFromStorage(key: string): any {
	try {
		const stored = localStorage.getItem(key);
		return stored ? JSON.parse(stored) : null;
	} catch (error) {
		console.error('Failed to load from localStorage:', error);
		return null;
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
	showroom: Showroom | null;
	roles: string[];
	epc_setting: EPCSetting | null;
}>({
	isLoading: false,
	isFetchingUser: false,
	isAuthenticated: false,
	user: null,
	showroom: null,
	roles: [],
	epc_setting: null,
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
		state.showroom = res?.message?.showroom ?? null;
		state.epc_setting = res?.message?.epc_setting ?? null;
		// Save roles to localStorage for instant access
		saveToStorage(SHOWROOM_STORAGE_KEY, res?.message?.showroom ?? null);
		saveToStorage(EPC_SETTING_STORAGE_KEY, res?.message?.epc_setting ?? null);
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
	state.roles = loadFromStorage(ROLES_STORAGE_KEY) ?? [];
	state.showroom = loadFromStorage(SHOWROOM_STORAGE_KEY) ?? null;
	state.epc_setting = loadFromStorage(EPC_SETTING_STORAGE_KEY) ?? null;
	state.isFetchingUser = true;
	// Then fetch fresh data from API in background
	await fetchLoggedInUser();
	console.log(state.epc_setting);
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

export interface UpdatePasswordResult {
	success: boolean;
	message: string;
}

async function updatePassword(
	newPassword: string
): Promise<UpdatePasswordResult> {
	try {
		const res = await frappe
			.call()
			.post<{ message: { success?: boolean; message?: string } }>(
				'employeediscount.api.user.update_password',
				{
					pwd: newPassword,
				}
			);

		if (res?.message?.success !== false) {
			return {
				success: true,
				message: res?.message?.message || 'Password updated successfully!',
			};
		} else {
			return {
				success: false,
				message: res?.message?.message || 'Failed to update password',
			};
		}
	} catch (error: any) {
		console.error('Error updating password:', error);

		// Try to decode _server_messages for cleaner error message
		let errorMsg = 'Failed to update password. Please try again.';

		if (error?._server_messages) {
			try {
				const serverMessages = JSON.parse(error._server_messages);
				if (Array.isArray(serverMessages) && serverMessages.length > 0) {
					const firstMessage = JSON.parse(serverMessages[0]);
					errorMsg = firstMessage.message || errorMsg;
				}
			} catch (parseError) {
				console.error('Failed to parse server messages:', parseError);
				errorMsg = error?.exception || error?.message || errorMsg;
			}
		} else {
			errorMsg = error?.exception || error?.message || errorMsg;
		}

		return {
			success: false,
			message: errorMsg,
		};
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
		updatePassword,
	};
}


