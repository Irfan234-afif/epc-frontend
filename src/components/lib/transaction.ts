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
		// Re-throw with error message for UI to handle
		throw new Error(error?.exception || error?.message || 'Transaction failed');
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

