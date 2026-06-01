import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter } from '@/router'
import App from '@/App.vue'
import { useAuthStore } from '@/stores/auth.store'
import '@/styles/index.css'

async function bootstrap() {
  const pinia = createPinia()
  const app = createApp(App)
  app.use(pinia)

  const authStore = useAuthStore()
  await authStore.initializeSession()

  app.use(createRouter())
  app.mount('#app')
}

void bootstrap()
