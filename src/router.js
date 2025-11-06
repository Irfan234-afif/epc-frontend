import { createWebHistory, createRouter } from 'vue-router'
import { frappe } from './components/lib/frappe'
import { getCookie } from './components/lib/utils';

import TheWelcome from './components/TheWelcome.vue';
import Login from './components/pages/auth/Login.vue';
import Home from './components/pages/home/Home.vue';
import PurchaseHistory from './components/pages/purchase_history/PurchaseHistory.vue';


const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => Home,
        meta: { requiresAuth: true }
    },
    {
        path: '/purchase-history',
        name: 'PurchaseHistory',
        component: () => PurchaseHistory,
        meta: { requiresAuth: true }
    },
    {
        path: '/login',
        name: 'Login',
        meta: { guest: true },
        component: () => Login
    }
];

export const router = createRouter({
    history: createWebHistory(),
    routes
});

// Ganti sesuai sumber auth Anda (Pinia/Vuex/Cookies/LocalStorage)
function isAuthenticated() {
    console.log("Checking authentication status...", document.cookie);
    console.log("!!getCookie('sid') :", !!getCookie('sid'));
    return !!getCookie('user_id') && getCookie('user_id') !== 'Guest';
}

router.beforeEach((to, from, next) => {
    // Blokir halaman protected jika belum login
    if (to.meta.requiresAuth && !isAuthenticated()) {
        return next({ path: '/login', query: { redirect: to.fullPath } });
    }

    // Blokir halaman guest (mis. login) jika sudah login
    if (to.meta.guest && isAuthenticated()) {
        return next({ path: '/' });
    }

    next();
});