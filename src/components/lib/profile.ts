import { frappe } from './frappe';

/**
 * Upload profile image file
 * @param file - The file to upload
 * @returns The file path/URL of the uploaded file
 */
export async function uploadProfileImage(file: File): Promise<string | null> {
	try {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('is_private', '0'); // Public file

		// @ts-ignore - import.meta.env is available in Vite
		const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
		const apiUrl = backendUrl 
			? `${backendUrl}/api/method/upload_file`
			: '/api/method/upload_file';
		
		const response = await fetch(apiUrl, {
			method: 'POST',
			body: formData,
			credentials: 'include', // Include cookies
			headers: {
				// Don't set Content-Type, let browser set it with boundary for FormData
			},
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.message || `Upload failed: ${response.statusText}`);
		}

		const data = await response.json();
		
		// Frappe upload_file returns { message: { file_url: "...", ... } }
		if (data?.message?.file_url) {
			return data.message.file_url;
		}
		
		// Alternative response format
		if (data?.message?.name) {
			// If it returns a file name, construct the URL
			const fileName = data.message.name;
			return `/files/${fileName}`;
		}

		throw new Error('Invalid response from upload endpoint');
	} catch (error: any) {
		console.error('Error uploading profile image:', error);
		
		// Try to decode _server_messages for cleaner error message
		let errorMsg = 'Failed to upload profile image. Please try again.';

		if (error?._server_messages) {
			try {
				const serverMessages = JSON.parse(error._server_messages);
				if (Array.isArray(serverMessages) && serverMessages.length > 0) {
					const firstMessage = JSON.parse(serverMessages[0]);
					errorMsg = firstMessage.message || errorMsg;
				}
			} catch (parseError) {
				console.error('Failed to parse server messages:', parseError);
				errorMsg = error?.message || errorMsg;
			}
		} else {
			errorMsg = error?.message || errorMsg;
		}

		throw new Error(errorMsg);
	}
}

export interface UpdateProfileInfoData {
	full_name?: string;
	email?: string;
	user_image?: string;
	[key: string]: any;
}

/**
 * Update user profile information
 * @param data - The profile data to update
 */
export async function updateProfileInfo(data: UpdateProfileInfoData): Promise<void> {
	try {
		// Filter out null and undefined values
		const filteredData: Record<string, any> = {};
		for (const [key, value] of Object.entries(data)) {
			if (value !== null && value !== undefined) {
				filteredData[key] = value;
			}
		}

		const res = await frappe
			.call()
			.post<{ message?: { success?: boolean; message?: string } }>(
				'frappe.desk.page.user_profile.user_profile.update_profile_info',
				{
					'profile_info': filteredData,
				}
			);

		if (res?.message?.success === false) {
			throw new Error(res.message.message || 'Failed to update profile');
		}
	} catch (error: any) {
		console.error('Error updating profile info:', error);

		// Try to decode _server_messages for cleaner error message
		let errorMsg = 'Failed to update profile. Please try again.';

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

		throw new Error(errorMsg);
	}
}

