import { frappe } from './frappe';

export interface Showroom {
	name: string;
	showroom_name: string;
	location: string;
	distance: string | null; // null if location permission not granted
	status: string;
	hours: string;
	image: string;
	phone: string;
	coordinates: {
		lat: number;
		lng: number;
	};
}

/**
 * Response structure from API for a single showroom
 */
export interface ShowroomResponse {
	name: string; // e.g., "SR-2025-00077"
	showroom_name: string; // e.g., "Melissa Grand Indonesia"
	sbu: string; // e.g., "Melissa"
	logo: string | null; // e.g., "/private/files/melissa.png"
	thumbnail: string | null; // e.g., null
	latitude: number; // e.g., -6.1955507
	longitude: number; // e.g., 106.8193637
	distance_km: number; // e.g., 1.69
}

/**
 * Response structure from API for showrooms list
 * Response format: { message: { data: ShowroomResponse[], total: number, page_length: number, page_start: number } }
 */
export interface ShowroomAPIResponse {
	data: ShowroomResponse[];
	total: number;
	page_length: number;
	page_start: number;
}

/**
 * Convert relative image path to full URL
 */
function getImageUrl(imagePath: string | null | undefined): string {
	if (!imagePath) return '';
	
	const backendUrl = import.meta.env.VITE_BACKEND_URL;
	if (!backendUrl) return imagePath;
	
	// If already a full URL, return as is
	if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
		return imagePath;
	}
	
	// Ensure backend URL doesn't end with slash
	const cleanBackendUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
	// Ensure path starts with slash
	const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
	
	return `${cleanBackendUrl}${cleanPath}`;
}

/**
 * Format distance in km
 */
function formatDistance(distanceKm: number): string {
	if (distanceKm < 1) {
		return `${Math.round(distanceKm * 1000)} m`;
	}
	return `${distanceKm.toFixed(1)} km`;
}

/**
 * Transform API response to Showroom interface
 */
function transformShowroomResponse(showroom: ShowroomResponse, hasLocation: boolean = true): Showroom {
	// Extract location from showroom_name (e.g., "Melissa Grand Indonesia" -> "Grand Indonesia")
	const location = showroom.showroom_name.replace(new RegExp(`^${showroom.sbu}\\s*`, 'i'), '').trim() || showroom.showroom_name;
	
	return {
		name: showroom.showroom_name,
		showroom_name: showroom.showroom_name,
		location: location,
		distance: hasLocation ? formatDistance(showroom.distance_km) : null,
		status: 'Open', // Default status, can be updated if API provides it
		hours: '10:00 - 22:00', // Default hours, can be updated if API provides it
		image: getImageUrl(showroom.thumbnail),
		phone: '', // Phone not in API response, can be updated if API provides it
		coordinates: {
			lat: showroom.latitude,
			lng: showroom.longitude,
		},
	};
}

/**
 * Get user's current location
 * Returns null if geolocation is not available or permission is denied
 */
export function getUserLocation(): Promise<{ latitude: number; longitude: number } | null> {
	return new Promise((resolve) => {
		if (!navigator.geolocation) {
			// Geolocation not available
			resolve(null);
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
                console.log('position', position);
				resolve({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
				});
			},
			(error) => {
				// Permission denied or other error
				console.warn('Error getting user location:', error);
				resolve(null);
			},
			{
				timeout: 5000,
				enableHighAccuracy: false,
			}
		);
	});
}

/**
 * Fetch showrooms by SBU
 * @param sbuName - Name of the SBU/brand
 * @param location - User location, null if permission not granted
 */
export async function fetchShowroomsBySBU(
	sbuName: string | null,
	location: { latitude: number; longitude: number } | null
): Promise<Showroom[]> {
	try {
		const params: Record<string, string> = {};
		
		// Only add sbu param if provided
		if (sbuName) {
			params.sbu = sbuName;
		}

		// Only add location params if location is available
		if (location) {
			params.latitude = location.latitude.toString();
			params.longitude = location.longitude.toString();
		}

		const res = await frappe
			.call()
			.get<{ message: ShowroomAPIResponse }>(
				'employeediscount.api.showrooms.get_showrooms_by_sbu',
				params
			);
		
		// Response structure: { message: { data: [...], total: number, page_length: number, page_start: number } }
		const responseData = res?.message;
		if (!responseData || !responseData.data) {
			return [];
		}
		
		const showrooms = responseData.data;
		const hasLocation = location !== null;
		return showrooms.map((showroom) => transformShowroomResponse(showroom, hasLocation));
	} catch (error) {
		console.error('Error fetching showrooms:', error);
		return [];
	}
}

