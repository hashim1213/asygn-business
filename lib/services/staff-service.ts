import type { Staff, StaffStatus, ApiResponse } from "@/types"
import { mockStaff } from "@/lib/utils/mock-data"

export class StaffService {
  private staff: Staff[] = [...mockStaff]

  async getStaff(): Promise<ApiResponse<Staff[]>> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      return {
        data: [...this.staff],
        success: true,
      }
    } catch (error) {
      return {
        data: [],
        success: false,
        error: "Failed to fetch staff",
      }
    }
  }

  async getStaffById(id: string): Promise<ApiResponse<Staff>> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))

      const staffMember = this.staff.find((s) => s.id === id)
      if (!staffMember) {
        return {
          data: null as any,
          success: false,
          error: "Staff member not found",
        }
      }

      return {
        data: staffMember,
        success: true,
      }
    } catch (error) {
      return {
        data: null as any,
        success: false,
        error: "Failed to fetch staff member",
      }
    }
  }

  async updateStaffStatus(id: string, status: StaffStatus): Promise<ApiResponse<Staff>> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const staffIndex = this.staff.findIndex((s) => s.id === id)
      if (staffIndex === -1) {
        return {
          data: null as any,
          success: false,
          error: "Staff member not found",
        }
      }

      this.staff[staffIndex].status = status

      return {
        data: this.staff[staffIndex],
        success: true,
      }
    } catch (error) {
      return {
        data: null as any,
        success: false,
        error: "Failed to update staff status",
      }
    }
  }

  async sendMessage(staffId: string, message: string): Promise<ApiResponse<any>> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      return {
        data: { staffId, message, sent: true },
        success: true,
      }
    } catch (error) {
      return {
        data: null,
        success: false,
        error: "Failed to send message",
      }
    }
  }
}

export const staffService = new StaffService()
