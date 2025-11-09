import { frappe } from './frappe';
import { UserCardResponse, QRCodeResponse } from './types';
import { Card } from '@/components/pages/home/useCardStack';

/**
 * Format number to IDR currency string with thousand separators
 * Example: 5500000 -> "IDR 5.500.000"
 */
function formatIDR(amount: number): string {
	const formatted = Math.abs(amount)
		.toString()
		.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
	return `IDR ${formatted}`;
}

/**
 * Convert relative logo path to full URL
 * Example: "/files/delami.png" -> "http://localhost:8000/files/delami.png"
 */
function getLogoUrl(logoPath: string | null | undefined): string | undefined {
	if (!logoPath) return undefined;
	
	const backendUrl = import.meta.env.VITE_BACKEND_URL;
	if (!backendUrl) return undefined;
	
	// Ensure backend URL doesn't end with slash
	const cleanBackendUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
	// Ensure path starts with slash
	const cleanPath = logoPath.startsWith('/') ? logoPath : `/${logoPath}`;
	
	return `${cleanBackendUrl}${cleanPath}`;
}

/**
 * Transform API response to Card interface
 */
function transformCardResponse(card: UserCardResponse): Card {
	return {
		code: card.name,
		limitType: card.epc_type,
		amount: formatIDR(card.current_balance),
		expiresIn: card.days_remaining ?? 0,
		bgColor: card.color,
		logoUrl: getLogoUrl(card.logo),
		logoAlt: card.epc_type,
	};
}

/**
 * Fetch user cards from backend API
 */
export async function fetchUserCards(): Promise<Card[]> {
	try {
		const res = await frappe
			.call()
			.get<{ message: UserCardResponse[] }>(
				'employeediscount.api.card.get_user_card'
			);
		
		const cards = res?.message ?? [];
		return cards.map(transformCardResponse);
	} catch (error) {
		console.error('Error fetching user cards:', error);
		return [];
	}
}

/**
 * Generate QR code for a card
 */
export async function generateQRCode(cardCode: string): Promise<QRCodeResponse | null> {
	try {
		const res = await frappe
			.call()
			.post<{ message: QRCodeResponse }>(
				'employeediscount.api.card.generate_qr_code',
				{
					epc_card: cardCode,
				}
			);
		
		return res?.message ?? null;
	} catch (error) {
		console.error('Error generating QR code:', error);
		return null;
	}
}

