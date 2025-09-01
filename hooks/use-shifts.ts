"use client"

import { useState, useEffect } from "react"
import type { Shift, ShiftFormData, ApiResponse } from "@/types"

export function useShifts() {
  const [shifts, setShifts] = useState<Shift[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchShifts()
  }, [])

  const fetchShifts = async () => {
    try {
      setLoading(true)
      // Simulate API call
      const response = await fetch("/api/shifts")
      const data: ApiResponse<Shift[]> = await response.json()

      if (data.success) {
        setShifts(data.data)
      } else {
        setError(data.error || "Failed to fetch shifts")
      }
    } catch (err) {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  const createShift = async (shiftData: ShiftFormData) => {
    try {
      const response = await fetch("/api/shifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shiftData),
      })
      const data: ApiResponse<Shift> = await response.json()

      if (data.success) {
        setShifts((prev) => [...prev, data.data])
        return { success: true, data: data.data }
      }
      return { success: false, error: data.error }
    } catch (err) {
      return { success: false, error: "Network error" }
    }
  }

  const updateShift = async (shiftId: string, updates: Partial<ShiftFormData>) => {
    try {
      const response = await fetch(`/api/shifts/${shiftId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      const data: ApiResponse<Shift> = await response.json()

      if (data.success) {
        setShifts((prev) => prev.map((shift) => (shift.id === shiftId ? data.data : shift)))
        return { success: true, data: data.data }
      }
      return { success: false, error: data.error }
    } catch (err) {
      return { success: false, error: "Network error" }
    }
  }

  const deleteShift = async (shiftId: string) => {
    try {
      const response = await fetch(`/api/shifts/${shiftId}`, {
        method: "DELETE",
      })
      const data: ApiResponse<any> = await response.json()

      if (data.success) {
        setShifts((prev) => prev.filter((shift) => shift.id !== shiftId))
        return { success: true }
      }
      return { success: false, error: data.error }
    } catch (err) {
      return { success: false, error: "Network error" }
    }
  }

  return {
    shifts,
    loading,
    error,
    createShift,
    updateShift,
    deleteShift,
    refetch: fetchShifts,
  }
}
