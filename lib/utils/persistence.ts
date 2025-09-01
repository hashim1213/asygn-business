"use client"

interface PersistenceOptions {
  key: string
  version?: number
  migrate?: (data: any, fromVersion: number, toVersion: number) => any
}

class Persistence {
  private isClient = typeof window !== "undefined"

  save<T>(key: string, data: T, options: { version?: number } = {}): boolean {
    if (!this.isClient) return false

    try {
      const payload = {
        data,
        version: options.version || 1,
        timestamp: Date.now(),
      }

      localStorage.setItem(key, JSON.stringify(payload))
      return true
    } catch (error) {
      console.error("Failed to save to localStorage:", error)
      return false
    }
  }

  load<T>(key: string, options: PersistenceOptions): T | null {
    if (!this.isClient) return null

    try {
      const item = localStorage.getItem(key)
      if (!item) return null

      const payload = JSON.parse(item)
      const { data, version = 1 } = payload

      // Handle version migration
      if (options.version && version !== options.version && options.migrate) {
        const migratedData = options.migrate(data, version, options.version)
        this.save(key, migratedData, { version: options.version })
        return migratedData
      }

      return data
    } catch (error) {
      console.error("Failed to load from localStorage:", error)
      return null
    }
  }

  remove(key: string): boolean {
    if (!this.isClient) return false

    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error("Failed to remove from localStorage:", error)
      return false
    }
  }

  clear(): boolean {
    if (!this.isClient) return false

    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error("Failed to clear localStorage:", error)
      return false
    }
  }

  exists(key: string): boolean {
    if (!this.isClient) return false
    return localStorage.getItem(key) !== null
  }

  // Get all keys with a prefix
  getKeys(prefix: string): string[] {
    if (!this.isClient) return []

    const keys: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(prefix)) {
        keys.push(key)
      }
    }
    return keys
  }
}

export const persistence = new Persistence()

// Utility functions for common use cases
export function saveUserPreferences(preferences: any): boolean {
  return persistence.save("user-preferences", preferences, { version: 1 })
}

export function loadUserPreferences(): any {
  return persistence.load("user-preferences", {
    key: "user-preferences",
    version: 1,
  })
}

export function saveFilters(feature: string, filters: any): boolean {
  return persistence.save(`filters-${feature}`, filters, { version: 1 })
}

export function loadFilters(feature: string): any {
  return persistence.load(`filters-${feature}`, {
    key: `filters-${feature}`,
    version: 1,
  })
}
