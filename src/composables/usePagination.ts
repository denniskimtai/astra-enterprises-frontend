import { ref } from 'vue'

export function usePagination(defaultPage = 1, defaultPageSize = 20) {
  const page = ref(defaultPage)
  const pageSize = ref(defaultPageSize)
  const total = ref(0)

  const setPage = (value: number) => {
    page.value = Math.max(1, value)
  }

  const setTotal = (value: number) => {
    total.value = Math.max(0, value)
  }

  const reset = () => {
    page.value = defaultPage
    pageSize.value = defaultPageSize
    total.value = 0
  }

  return {
    page,
    pageSize,
    total,
    setPage,
    setTotal,
    reset
  }
}
