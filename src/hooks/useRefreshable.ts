import { useState, useEffect } from 'react'

type RefreshCallback = (data?: unknown) => void | Promise<void>

class RefreshEventEmitter {
  private events: Record<string, RefreshCallback[]>

  constructor() {
    this.events = {}
  }

  on(event: string, callback: RefreshCallback): void {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }

  emit(event: string, data?: unknown): void {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data))
    }
  }

  remove(event: string, callback: RefreshCallback): void {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback)
    }
  }
}

export const refreshEvents = new RefreshEventEmitter()

const useRefreshable = (componentId: string, onRefresh: () => Promise<void> | void): boolean => {
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)

  useEffect(() => {
    const handleRefresh = async () => {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
      }
    }

    refreshEvents.on(`refresh:${componentId}`, handleRefresh)
    return () => refreshEvents.remove(`refresh:${componentId}`, handleRefresh)
  }, [componentId, onRefresh])

  return isRefreshing
}

export default useRefreshable
