import { createWebHistory, createRouter } from 'vue-router'
import { frappe } from './components/lib/frappe'
import { getCookie } from './components/lib/utils';

import TheWelcome from './components/TheWelcome.vue';
import Login from './components/pages/auth/Login.vue';
import Home from './components/pages/home/Home.vue';
import PurchaseHistory from './components/pages/purchase_history/PurchaseHistory.vue';
import Notification from './components/pages/notification/Notification.vue';
import Offers from './components/pages/offers/Offers.vue';
import Stamps from './components/pages/stamps/Stamps.vue';
import FindStores from './components/pages/find-stores/FindStores.vue';
import Cashier from './components/pages/cashier/Cashier.vue';
import TransactionResult from './components/pages/cashier/TransactionResult.vue';


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
        path: '/notifications',
        name: 'Notification',
        component: () => Notification,
        meta: { requiresAuth: true }
    },
    {
        path: '/offers',
        name: 'Offers',
        component: () => Offers,
        meta: { requiresAuth: true }
    },
    {
        path: '/stamps',
        name: 'Stamps',
        component: () => Stamps,
        meta: { requiresAuth: true }
    },
    {
        path: '/find-stores',
        name: 'FindStores',
        component: () => FindStores,
        meta: { requiresAuth: true }
    },
    {
        path: '/cashier',
        name: 'Cashier',
        component: () => Cashier,
        meta: { requiresAuth: true }
    },
    {
        path: '/cashier/transaction-result/:id',
        name: 'TransactionResult',
        component: () => TransactionResult,
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