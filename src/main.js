import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { frappe } from './frappe'
import { router } from './router';



createApp(App).use(router).mount('#app')
frappe;

