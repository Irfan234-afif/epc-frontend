import { FrappeApp } from "frappe-js-sdk";

// Untuk development dengan proxy, VITE_BACKEND_URL harus kosong atau path relatif
// Contoh: VITE_BACKEND_URL="" atau VITE_BACKEND_URL="/"
// Ini memastikan request melewati proxy di vite.config.js agar cookies bekerja
var backendUrl = import.meta.env.VITE_BACKEND_URL || '';
if (import.meta.env.DEV) {
    // Environment is development
    backendUrl = '';
}

export const frappe = new FrappeApp(backendUrl, {
    useToken: false,
    // This can be "Bearer" or "token"
    type: "Bearer"
})