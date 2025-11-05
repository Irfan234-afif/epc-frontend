import { FrappeApp } from "frappe-js-sdk";

function getTokenFromLocalStorage() {
    return localStorage.getItem("token");
}

export const frappe = new FrappeApp(import.meta.env.VITE_BACKEND_URL, {
    useToken: true,
    // Pass a custom function that returns the token as a string - this could be fetched from LocalStorage or auth providers like Firebase, Auth0 etc.
    token: getTokenFromLocalStorage(),
    // This can be "Bearer" or "token"
    type: "Bearer"
})