import { frappe } from './frappe';

export interface Brand {
	id: number;
	name: string;
	logo: string;
}

interface SBUResponse {
	name: string;
	sbu_name: string;
	logo: string | null;
}

/**
 * Convert relative logo path to full URL
 * Example: "/files/delami.png" -> "http://localhost:8000/files/delami.png"
 */
function getLogoUrl(logoPath: string | null | undefined): string {
	if (!logoPath) return '';
	
	const backendUrl = import.meta.env.VITE_BACKEND_URL;
	if (!backendUrl) return logoPath;
	
	// If already a full URL, return as is
	if (logoPath.startsWith('http://') || logoPath.startsWith('https://')) {
		return logoPath;
	}
	
	// Ensure backend URL doesn't end with slash
	const cleanBackendUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
	// Ensure path starts with slash
	const cleanPath = logoPath.startsWith('/') ? logoPath : `/${logoPath}`;
	
	return `${cleanBackendUrl}${cleanPath}`;
}

/**
 * Generate a simple numeric hash from string
 */
function hashString(str: string): number {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return Math.abs(hash);
}

/**
 * Transform SBU response to Brand interface
 */
function transformSBUResponse(sbu: SBUResponse): Brand {
	const brandName = sbu.sbu_name || sbu.name;
	return {
		id: hashString(sbu.name), // Use hash of SBU name as ID for consistency
		name: brandName,
		logo: getLogoUrl(sbu.logo),
	};
}

/**
 * Fetch brands from SBU doctype
 */
export async function fetchBrands(): Promise<Brand[]> {
	try {
		const sbus = await frappe
			.db()
			.getDocList<SBUResponse>('SBU', {
				fields: ['name', 'sbu_name', 'logo'],
				orderBy: {
					field: 'sbu_name',
					order: 'asc'
				}
			});
		
		return sbus.map((sbu) => transformSBUResponse(sbu));
	} catch (error) {
		console.error('Error fetching brands:', error);
		return [];
	}
}

