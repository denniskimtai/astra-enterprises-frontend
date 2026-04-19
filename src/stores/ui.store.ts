import { defineStore } from 'pinia'
import type { Notification } from '@/composables/useNotification'

export const useUiStore = defineStore('ui', {
  state: () => ({
    sidebarOpen: true,
    loading: false,
    notifications: [] as Notification[]
  }),
  actions: {
    setSidebarOpen(open: boolean) {
      this.sidebarOpen = open
    },
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },
    closeSidebar() {
      this.sidebarOpen = false
    },
    setLoading(value: boolean) {
      this.loading = value
    },
    addNotification(notification: Notification) {
      this.notifications.push(notification)
    },
    removeNotification(id: string) {
      this.notifications = this.notifications.filter((item) => item.id !== id)
    }
  }
})
