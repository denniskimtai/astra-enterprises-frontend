import { ref } from 'vue'

export type NotificationType = 'success' | 'error' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  message: string
}

const notifications = ref<Notification[]>([])

export function useNotification() {
  const push = (type: NotificationType, message: string) => {
    const id = crypto.randomUUID()
    notifications.value.push({ id, type, message })
    return id
  }

  const remove = (id: string) => {
    notifications.value = notifications.value.filter((item) => item.id !== id)
  }

  return {
    notifications,
    push,
    remove
  }
}
