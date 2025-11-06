import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { frappe } from './components/lib/frappe'
import { router } from './router';
import { useAuth } from '@/components/lib/auth';

const app = createApp(App)
app.use(router)

// Initialize auth state in background
useAuth().initAuth()

app.mount('#app')
frappe;

