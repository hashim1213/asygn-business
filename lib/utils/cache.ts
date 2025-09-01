interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

class Cache {
  private storage = new Map<string, CacheItem<any>>()
  private defaultTTL = 5 * 60 * 1000 // 5 minutes

  set<T>(key: string, data: T, ttl?: number): void {
    this.storage.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    })
  }

  get<T>(key: string): T | null {
    const item = this.storage.get(key)

    if (!item) {
      return null
    }

    const now = Date.now()
    if (now - item.timestamp > item.ttl) {
      this.storage.delete(key)
      return null
    }

    return item.data
  }

  has(key: string): boolean {
    const item = this.storage.get(key)

    if (!item) {
      return false
    }

    const now = Date.now()
    if (now - item.timestamp > item.ttl) {
      this.storage.delete(key)
      return false
    }

    return true
  }

  delete(key: string): void {
    this.storage.delete(key)
  }

  clear(): void {
    this.storage.clear()
  }

  // Clean up expired items
  cleanup(): void {
    const now = Date.now()

    for (const [key, item] of this.storage.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.storage.delete(key)
      }
    }
  }

  // Get cache statistics
  getStats() {
    return {
      size: this.storage.size,
      keys: Array.from(this.storage.keys()),
    }
  }
}

export const cache = new Cache()

// Clean up expired items every 5 minutes
if (typeof window !== "undefined") {
  setInterval(
    () => {
      cache.cleanup()
    },
    5 * 60 * 1000,
  )
}
