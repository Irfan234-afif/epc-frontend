import { frappe } from './frappe';
import { Showroom, Transaction, TransactionRequest, TransactionResponse } from './types';

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
		
		const res = await frappe
			.call()
			.post<{ message: TransactionResponse }>(
				'employeediscount.api.card.process_transaction',
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

