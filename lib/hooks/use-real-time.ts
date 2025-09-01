"use client"

import { useEffect, useCallback } from "react"
import type { StaffUpdateEvent, ShiftUpdateEvent } from "@/types"

interface RealTimeOptions {
  onStaffUpdate?: (event: StaffUpdateEvent) => void
  onShiftUpdate?: (event: ShiftUpdateEvent) => void
  onConnect?: () => void
  onDisconnect?: () => void
}

export function useRealTime(options: RealTimeOptions = {}) {
  const { onStaffUpdate, onShiftUpdate, onConnect, onDisconnect } = options

  // Simulate WebSocket connection
  useEffect(() => {
    let connected = true
    onConnect?.()

    // Simulate real-time staff updates
    const staffInterval = setInterval(() => {
      if (!connected) return

      const staffEvents: StaffUpdateEvent[] = [
        {
          type: "status_change",
          staffId: "1",
          timestamp: new Date().toISOString(),
          data: { status: Math.random() > 0.5 ? "active" : "on-break" },
        },
        {
          type: "location_update",
          staffId: "2",
          timestamp: new Date().toISOString(),
          data: { lat: 40.7128 + (Math.random() - 0.5) * 0.01, lng: -74.006 + (Math.random() - 0.5) * 0.01 },
        },
      ]

      const randomEvent = staffEvents[Math.floor(Math.random() * staffEvents.length)]
      onStaffUpdate?.(randomEvent)
    }, 30000) // Every 30 seconds

    // Simulate real-time shift updates
    const shiftInterval = setInterval(() => {
      if (!connected) return

      const shiftEvent: ShiftUpdateEvent = {
        type: "updated",
        shiftId: "1",
        timestamp: new Date().toISOString(),
        data: { status: "filled" },
      }

      if (Math.random() > 0.8) {
        onShiftUpdate?.(shiftEvent)
      }
    }, 60000) // Every minute

    return () => {
      connected = false
      clearInterval(staffInterval)
      clearInterval(shiftInterval)
      onDisconnect?.()
    }
  }, [onStaffUpdate, onShiftUpdate, onConnect, onDisconnect])

  const sendMessage = useCallback((type: string, data: any) => {
    // Simulate sending message through WebSocket
    console.log("Sending real-time message:", { type, data })
  }, [])

  return {
    sendMessage,
  }
}
