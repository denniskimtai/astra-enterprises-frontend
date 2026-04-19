export function debounce<T extends (...args: unknown[]) => void>(callback: T, delay = 300) {
  let timer: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      callback(...args)
    }, delay)
  }
}
