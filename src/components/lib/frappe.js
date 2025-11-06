import { FrappeApp } from "frappe-js-sdk";

export const frappe = new FrappeApp(import.meta.env.VITE_BACKEND_URL, {
    useToken: false,
    // This can be "Bearer" or "token"
    type: "Bearer"
})