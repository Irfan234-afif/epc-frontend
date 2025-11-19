import { createWebHistory, createRouter } from 'vue-router'
import { frappe } from './components/lib/frappe'
import { getCookie } from './components/lib/utils';
import { useAuth } from './components/lib/auth';
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
import EmployeeTransactionResult from './components/pages/home/EmployeeTransactionResult.vue';
import ForbiddenPage from './components/pages/default/ForbiddenPage.vue';
import LoadingPage from './components/pages/default/LoadingPage.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: { requiresAuth: true, roles: ['Employee'] }
    },
    {
        path: '/purchase-history',
        name: 'PurchaseHistory',
        component: PurchaseHistory,
        meta: { requiresAuth: true, roles: ['Employee'] }
    },
    {
        path: '/notifications',
        name: 'Notification',
        component: Notification,
        meta: { requiresAuth: true, roles: ['Employee'] }
    },
    {
        path: '/offers',
        name: 'Offers',
        component: Offers,
        meta: { requiresAuth: true, roles: ['Employee'] }
    },
    {
        path: '/stamps',
        name: 'Stamps',
        component: Stamps,
        meta: { requiresAuth: true, roles: ['Employee'] }
    },
    {
        path: '/find-stores',
        name: 'FindStores',
        component: FindStores,
        meta: { requiresAuth: true, roles: ['Employee'] }
    },
    {
        path: '/cashier',
        name: 'Cashier',
        component: Cashier,
        meta: { requiresAuth: true, roles: ['Cashier'] }
    },
    {
        path: '/cashier/transaction-result/:id',
        name: 'TransactionResult',
        component: TransactionResult,
        meta: { requiresAuth: true, roles: ['Cashier'] }
    },
    {
        path: '/transaction-result/:id',
        name: 'EmployeeTransactionResult',
        component: EmployeeTransactionResult,
        meta: { requiresAuth: true, roles: ['Employee'] }
    },
    {
        path: '/forbidden',
        name: 'Forbidden',
        component: ForbiddenPage,
        meta: { requiresAuth: true, }
    },
    {
        path: '/loading',
        name: 'Loading',
        component: LoadingPage,
    },
    {
        path: '/login',
        name: 'Login',
        meta: { guest: true },
        component: Login
    }
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        // Selalu scroll ke atas saat pindah halaman
        if (savedPosition) {
            return savedPosition;
        } else {
            return { top: 0, behavior: 'smooth' };
        }
    }
});

// Check authentication based on cookies
function isAuthenticated() {
    return !!getCookie('user_id') && getCookie('user_id') !== 'Guest';
}

router.beforeEach((to, from, next) => {
    // Blokir halaman protected jika belum login
    if (to.meta.requiresAuth && !isAuthenticated()) {
        return next({ path: '/login', query: { redirect: to.fullPath } });
    }

    const { state, userHomePage } = useAuth();

    if (to.path === '/' && userHomePage() !== '/') {
        return next({ path: userHomePage() });
    }

    // Check role-based access
    if (to.meta.requiresAuth && to.meta.roles && to.meta.roles.length > 0) {
        // Check if user has at least one of the required roles
        const hasRequiredRole = to.meta.roles.some(role => state.roles.includes(role));

        if (!hasRequiredRole) {
            console.log('Forbidden - User roles:', state.roles, 'Required roles:', to.meta.roles);
            return next({ path: '/forbidden'});
        }
    }

    // Blokir halaman guest (mis. login) jika sudah login
    if (to.meta.guest && isAuthenticated()) {
        return next({ path: '/' });
    }

    next();
});