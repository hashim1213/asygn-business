import type { Worker, WorkerFilters, ApiResponse } from "@/types"
import { mockWorkers } from "@/lib/utils/mock-data"

export class WorkerService {
  async getWorkers(filters?: WorkerFilters): Promise<ApiResponse<Worker[]>> {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      let workers = [...mockWorkers]

      if (filters) {
        // Apply filters
        if (filters.skills.length > 0) {
          workers = workers.filter((worker) => filters.skills.some((skill) => worker.skills.includes(skill)))
        }

        if (filters.availability.length > 0) {
          workers = workers.filter((worker) => filters.availability.includes(worker.availability))
        }

        if (filters.minRating > 0) {
          workers = workers.filter((worker) => worker.rating >= filters.minRating)
        }

        if (filters.maxDistance < 100) {
          workers = workers.filter((worker) => worker.distance <= filters.maxDistance)
        }

        if (filters.maxRate > 0) {
          workers = workers.filter((worker) => worker.hourlyRate <= filters.maxRate)
        }

        // Apply sorting
        workers.sort((a, b) => {
          switch (filters.sortBy) {
            case "rating":
              return b.rating - a.rating
            case "distance":
              return a.distance - b.distance
            case "rate":
              return a.hourlyRate - b.hourlyRate
            case "experience":
              return b.experience - a.experience
            default:
              return 0
          }
        })
      }

      return {
        data: workers,
        success: true,
      }
    } catch (error) {
      return {
        data: [],
        success: false,
        error: "Failed to fetch workers",
      }
    }
  }

  async getWorkerById(id: string): Promise<ApiResponse<Worker>> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))

      const worker = mockWorkers.find((w) => w.id === id)
      if (!worker) {
        return {
          data: null as any,
          success: false,
          error: "Worker not found",
        }
      }

      return {
        data: worker,
        success: true,
      }
    } catch (error) {
      return {
        data: null as any,
        success: false,
        error: "Failed to fetch worker",
      }
    }
  }

  async hireWorker(workerId: string, shiftId: string): Promise<ApiResponse<any>> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate hiring logic
      return {
        data: { workerId, shiftId, status: "hired" },
        success: true,
      }
    } catch (error) {
      return {
        data: null,
        success: false,
        error: "Failed to hire worker",
      }
    }
  }

  async sendMessage(workerId: string, message: string): Promise<ApiResponse<any>> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      return {
        data: { workerId, message, sent: true },
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

export const workerService = new WorkerService()
