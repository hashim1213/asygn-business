"use client"

import { useState, useEffect } from "react"
import type { Staff, ApiResponse } from "@/types"

export function useStaff() {
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStaff()

    // Set up real-time updates (simulate with interval)
    const interval = setInterval(() => {
      // Simulate real-time staff updates
      setStaff((prev) =>
        prev.map((member) => ({
          ...member,
          // Randomly update some staff statuses for demo
          status: Math.random() > 0.9 ? ((Math.random() > 0.5 ? "on-break" : "active") as any) : member.status,
        })),
      )
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const fetchStaff = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/staff")
      const data: ApiResponse<Staff[]> = await response.json()

      if (data.success) {
        setStaff(data.data)
      } else {
        setError(data.error || "Failed to fetch staff")
      }
    } catch (err) {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  const updateStaffStatus = async (staffId: string, status: Staff["status"]) => {
    try {
      const response = await fetch(`/api/staff/${staffId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      const data: ApiResponse<Staff> = await response.json()

      if (data.success) {
        setStaff((prev) => prev.map((member) => (member.id === staffId ? data.data : member)))
        return { success: true }
      }
      return { success: false, error: data.error }
    } catch (err) {
      return { success: false, error: "Network error" }
    }
  }

  return {
    staff,
    loading,
    error,
    updateStaffStatus,
    refetch: fetchStaff,
  }
}
