"use client"

import { useState, useEffect } from "react"
import type { Worker, WorkerFilters, ApiResponse } from "@/types"

export function useWorkers(filters?: WorkerFilters) {
  const [workers, setWorkers] = useState<Worker[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        setLoading(true)
        // Simulate API call - replace with actual API
        const response = await fetch("/api/workers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filters }),
        })
        const data: ApiResponse<Worker[]> = await response.json()

        if (data.success) {
          setWorkers(data.data)
        } else {
          setError(data.error || "Failed to fetch workers")
        }
      } catch (err) {
        setError("Network error")
      } finally {
        setLoading(false)
      }
    }

    fetchWorkers()
  }, [filters])

  const hireWorker = async (workerId: string, shiftId: string) => {
    try {
      const response = await fetch("/api/workers/hire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workerId, shiftId }),
      })
      const data: ApiResponse<any> = await response.json()
      return data.success
    } catch {
      return false
    }
  }

  return {
    workers,
    loading,
    error,
    hireWorker,
    refetch: () => setWorkers([]),
  }
}
