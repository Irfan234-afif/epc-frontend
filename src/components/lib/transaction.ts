import { frappe } from './frappe';
import { Showroom, Transaction, TransactionRequest, TransactionResponse, TransactionListItem, QRValidationResponse, TransactionHistoryResponse } from './types';

/**
 * Fetch list of showrooms from backend API
 */
export async function fetchShowrooms(): Promise<Showroom[]> {
	try {
		const res = await frappe
			.call()
			.get<{ message: Showroom[] }>(
				'employeediscount.api.user.get_showrooms'
			);
		
		return res?.message ?? [];
	} catch (error) {
		console.error('Error fetching showrooms:', error);
		return [];
	}
}

/**
 * Process a transaction
 */
export async function processTransaction(data: TransactionRequest): Promise<TransactionResponse | null> {
	try {
		const payload: Record<string, any> = {
			qr_value: data.qr_value,
			amount: data.amount.toString(),
			showroom: data.showroom,
			title: data.title,
		};
		
		if (data.description) {
			payload.description = data.description;
		}
		
		if (data.from_amount !== undefined) {
			payload.from_amount = data.from_amount.toString();
		}
		
		if (data.to_amount !== undefined) {
			payload.to_amount = data.to_amount.toString();
		}
		
		const res = await frappe
			.call()
			.post<{ message: TransactionResponse }>(
				'employeediscount.api.transaction.process_transaction',
				payload
			);
		
		return res?.message ?? null;
	} catch (error: any) {
		console.error('Error processing transaction:', error);
		
		// Try to decode _server_messages for cleaner error message
		let errorMessage = 'Transaction failed';
		
		if (error?._server_messages) {
			try {
				const serverMessages = JSON.parse(error._server_messages);
				if (Array.isArray(serverMessages) && serverMessages.length > 0) {
					const firstMessage = JSON.parse(serverMessages[0]);
					errorMessage = firstMessage.message || errorMessage;
				}
			} catch (parseError) {
				console.error('Failed to parse server messages:', parseError);
				errorMessage = error?.exception || error?.message || errorMessage;
			}
		} else {
			errorMessage = error?.exception || error?.message || errorMessage;
		}
		
		// Re-throw with error type and clean message for UI to handle
		const errorObj = new Error(errorMessage) as any;
		errorObj.exc_type = error?.exc_type;
		throw errorObj;
	}
}

/**
 * Get transaction details by ID
 */
export async function getTransactionDetail(transactionId: string): Promise<Transaction | null> {
	try {
		const res = await frappe
			.db()
			.getDoc<Transaction>('EPC Transaction', transactionId);
		
		return res ?? null;
	} catch (error: any) {
		console.error('Error fetching transaction detail:', error);
		throw new Error(error?.exception || error?.message || 'Failed to fetch transaction details');
	}
}

export async function getStoreName(store_id): Promise<string | null>  {
	try {
		const res = await frappe
			.db()
			.getDoc('Showroom', store_id);
		return res?.showroom_name ?? null;
	} catch (error) {
		return null;
	}
}

/**
 * List transactions by card, year, and month
 */
export async function listTransactionsByCard(
	cardId: string,
	year: number,
	month: number
): Promise<TransactionListItem[]> {
	try {
		// Use the call API with params as query string
		// Frappe SDK handles GET requests with query parameters
		const method = 'employeediscount.api.transaction.list_transaction_by_card';
		const params = {
			card_id: cardId,
			year: year.toString(),
			month: month.toString(),
		};
		
		// Build URL with query parameters
		// @ts-ignore - import.meta.env is available in Vite
		// const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
		// const cleanBackendUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
		// const queryString = new URLSearchParams(params).toString();
		// const url = `${cleanBackendUrl}/api/method/${method}?${queryString}`;
		
		// // Use fetch directly since frappe.call().get() might not support query params easily
		// const response = await fetch(url, {
		// 	method: 'GET',
		// 	credentials: 'include',
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 	},
		// });
		const response = await frappe.call().get<{ message: TransactionListItem[] }>(method, params);
		
		return response?.message ?? [];
	} catch (error) {
		console.error('Error fetching transactions by card:', error);
		return [];
	}
}

/**
 * Validate QR code and get employee card information
 */
export async function validateQRCode(qrValue: string, showroom: string): Promise<QRValidationResponse | null> {
	try {
		const res = await frappe
			.call()
			.post<{ message: QRValidationResponse }>(
				'employeediscount.api.transaction.get_employee_with_validation',
				{
					qr_value: qrValue,
					showroom: showroom,
				}
			);
		
		return res?.message ?? null;
	} catch (error: any) {
		console.error('Error validating QR code:', error);
		
		// Try to decode _server_messages for cleaner error message
		let errorMessage = 'QR code validation failed';
		
		if (error?._server_messages) {
			try {
				const serverMessages = JSON.parse(error._server_messages);
				if (Array.isArray(serverMessages) && serverMessages.length > 0) {
					const firstMessage = JSON.parse(serverMessages[0]);
					errorMessage = firstMessage.message || errorMessage;
				}
			} catch (parseError) {
				console.error('Failed to parse server messages:', parseError);
				errorMessage = error?.exception || error?.message || errorMessage;
			}
		} else {
			errorMessage = error?.exception || error?.message || errorMessage;
		}
		
		// Re-throw with error type and clean message for UI to handle
		const errorObj = new Error(errorMessage) as any;
		errorObj.exc_type = error?.exc_type;
		throw errorObj;
	}
}

/**
 * Submit Payment ID for a transaction
 * TODO: Implement API call when endpoint is ready
 */
export async function submitPaymentID(
	transactionId: string,
	paymentId: string
): Promise<{ success: boolean; message?: string }> {
	try {
		const res = await frappe
			.call()
			.post<{ message: { success: boolean; message?: string } }>(
				'employeediscount.api.transaction.input_payment_id',
				{
					transaction_id: transactionId,
					payment_id: paymentId,
				}
			);
		
		return res?.message ?? null;
	} catch (error: any) {
		console.error('Error validating QR code:', error);
		
		// Try to decode _server_messages for cleaner error message
		let errorMessage = 'QR code validation failed';
		
		if (error?._server_messages) {
			try {
				const serverMessages = JSON.parse(error._server_messages);
				if (Array.isArray(serverMessages) && serverMessages.length > 0) {
					const firstMessage = JSON.parse(serverMessages[0]);
					errorMessage = firstMessage.message || errorMessage;
				}
			} catch (parseError) {
				console.error('Failed to parse server messages:', parseError);
				errorMessage = error?.exception || error?.message || errorMessage;
			}
		} else {
			errorMessage = error?.exception || error?.message || errorMessage;
		}
		
		// Re-throw with error type and clean message for UI to handle
		const errorObj = new Error(errorMessage) as any;
		errorObj.exc_type = error?.exc_type;
		throw errorObj;
	}
}

/**
 * List transactions for cashier by showroom and QR value
 */
export async function listTransactionCashier(
	showroom: string,
	qrValue: string
): Promise<TransactionHistoryResponse | null> {
	try {
		// @ts-ignore - import.meta.env is available in Vite
		const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
		const cleanBackendUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
		const method = 'employeediscount.api.transaction.list_transaction_cashier';
		const url = `${cleanBackendUrl}/api/method/${method}?showroom=${encodeURIComponent(showroom)}`;
		
		// Create FormData for the request body
		const formData = new FormData();
		formData.append('qr_value', qrValue);
		
		// Use fetch directly since this is a GET request with formdata body (non-standard)
		const response = await fetch(url, {
			method: 'GET',
			credentials: 'include',
			body: formData,
		});
		
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		
		const data = await response.json();
		return data?.message ?? null;
	} catch (error: any) {
		console.error('Error fetching transaction history for cashier:', error);
		
		// Try to decode _server_messages for cleaner error message
		let errorMessage = 'Failed to fetch transaction history';
		
		if (error?._server_messages) {
			try {
				const serverMessages = JSON.parse(error._server_messages);
				if (Array.isArray(serverMessages) && serverMessages.length > 0) {
					const firstMessage = JSON.parse(serverMessages[0]);
					errorMessage = firstMessage.message || errorMessage;
				}
			} catch (parseError) {
				console.error('Failed to parse server messages:', parseError);
				errorMessage = error?.exception || error?.message || errorMessage;
			}
		} else {
			errorMessage = error?.exception || error?.message || errorMessage;
		}
		
		// Re-throw with error type and clean message for UI to handle
		const errorObj = new Error(errorMessage) as any;
		errorObj.exc_type = error?.exc_type;
		throw errorObj;
	}
}

/**
 * List transaction history for cashier by showroom only (for transaction history page)
 */
export async function listTransactionHistoryByShowroom(
	showroom: string,
	year: number | null = null,
	month: number | null = null,
	epc_type: string | null = null
): Promise<TransactionHistoryResponse | null> {
	try {
		// @ts-ignore - import.meta.env is available in Vite
		// const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
		// const cleanBackendUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
		const method = 'employeediscount.api.transaction.list_transaction_cashier';
		// const url = `${cleanBackendUrl}/api/method/${method}?showroom=${encodeURIComponent(showroom)}`;
		
		// // Create FormData for the request body (qr_value can be empty for listing all transactions)
		// const formData = new FormData();
		// formData.append('qr_value', '');
		
		// Use fetch directly since this is a GET request with formdata body (non-standard)
		const response = await frappe.call().get<{ message: TransactionHistoryResponse }>(method, { showroom: showroom, year: year, month: month, epc_type: epc_type });
		
		return response?.message ?? null;
	} catch (error: any) {
		console.error('Error fetching transaction history by showroom:', error);
		
		// Try to decode _server_messages for cleaner error message
		let errorMessage = 'Failed to fetch transaction history';
		
		if (error?._server_messages) {
			try {
				const serverMessages = JSON.parse(error._server_messages);
				if (Array.isArray(serverMessages) && serverMessages.length > 0) {
					const firstMessage = JSON.parse(serverMessages[0]);
					errorMessage = firstMessage.message || errorMessage;
				}
			} catch (parseError) {
				console.error('Failed to parse server messages:', parseError);
				errorMessage = error?.exception || error?.message || errorMessage;
			}
		} else {
			errorMessage = error?.exception || error?.message || errorMessage;
		}
		
		// Re-throw with error type and clean message for UI to handle
		const errorObj = new Error(errorMessage) as any;
		errorObj.exc_type = error?.exc_type;
		throw errorObj;
	}
}

