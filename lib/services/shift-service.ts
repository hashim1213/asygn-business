import type { Shift, ShiftFormData, ApiResponse } from "@/types"
import { mockShifts } from "@/lib/utils/mock-data"

export class ShiftService {
  private shifts: Shift[] = [...mockShifts]

  async getShifts(): Promise<ApiResponse<Shift[]>> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      return {
        data: [...this.shifts],
        success: true,
      }
    } catch (error) {
      return {
        data: [],
        success: false,
        error: "Failed to fetch shifts",
      }
    }
  }

  async getShiftById(id: string): Promise<ApiResponse<Shift>> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))

      const shift = this.shifts.find((s) => s.id === id)
      if (!shift) {
        return {
          data: null as any,
          success: false,
          error: "Shift not found",
        }
      }

      return {
        data: shift,
        success: true,
      }
    } catch (error) {
      return {
        data: null as any,
        success: false,
        error: "Failed to fetch shift",
      }
    }
  }

  async createShift(shiftData: ShiftFormData): Promise<ApiResponse<Shift>> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newShift: Shift = {
        ...shiftData,
        id: Date.now().toString(),
        status: "published" as any,
        assignedWorkers: [],
        urgency: "medium" as any,
      }

      this.shifts.push(newShift)

      return {
        data: newShift,
        success: true,
      }
    } catch (error) {
      return {
        data: null as any,
        success: false,
        error: "Failed to create shift",
      }
    }
  }

  async updateShift(id: string, updates: Partial<ShiftFormData>): Promise<ApiResponse<Shift>> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const shiftIndex = this.shifts.findIndex((s) => s.id === id)
      if (shiftIndex === -1) {
        return {
          data: null as any,
          success: false,
          error: "Shift not found",
        }
      }

      this.shifts[shiftIndex] = { ...this.shifts[shiftIndex], ...updates }

      return {
        data: this.shifts[shiftIndex],
        success: true,
      }
    } catch (error) {
      return {
        data: null as any,
        success: false,
        error: "Failed to update shift",
      }
    }
  }

  async deleteShift(id: string): Promise<ApiResponse<any>> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const shiftIndex = this.shifts.findIndex((s) => s.id === id)
      if (shiftIndex === -1) {
        return {
          data: null,
          success: false,
          error: "Shift not found",
        }
      }

      this.shifts.splice(shiftIndex, 1)

      return {
        data: { deleted: true },
        success: true,
      }
    } catch (error) {
      return {
        data: null,
        success: false,
        error: "Failed to delete shift",
      }
    }
  }

  async fillShift(id: string, workerIds: string[]): Promise<ApiResponse<Shift>> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))

      const shiftIndex = this.shifts.findIndex((s) => s.id === id)
      if (shiftIndex === -1) {
        return {
          data: null as any,
          success: false,
          error: "Shift not found",
        }
      }

      // Simulate adding workers to shift
      const shift = this.shifts[shiftIndex]
      shift.status = workerIds.length >= shift.maxWorkers ? "filled" : "published"

      return {
        data: shift,
        success: true,
      }
    } catch (error) {
      return {
        data: null as any,
        success: false,
        error: "Failed to fill shift",
      }
    }
  }
}

export const shiftService = new ShiftService()
