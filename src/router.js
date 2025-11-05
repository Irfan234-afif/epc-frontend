import { createMemoryHistory, createRouter } from 'vue-router'
import { frappe } from './frappe'

import TheWelcome from './components/TheWelcome.vue';
import Login from './components/pages/auth/Login.vue';


const routes = [
    {
        path: '/',
        component: () => TheWelcome,
        meta: { requiresAuth: true }
    },
    {
        path: '/login',
        component: () => Login
    }
];

export const router = createRouter({
    history: createMemoryHistory(),
    routes
});

// Ganti sesuai sumber auth Anda (Pinia/Vuex/Cookies/LocalStorage)
function isAuthenticated() {
    const auth = frappe.auth();
    // console.log("Auth frappe : ", auth.);
    return auth.token != null;
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