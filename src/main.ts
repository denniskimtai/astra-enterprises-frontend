import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter } from '@/router'
import App from '@/App.vue'
import { useAuth } from '@/composables/useAuth'
import '@/styles/index.css'

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
useAuth()
app.use(createRouter())
app.mount('#app')
