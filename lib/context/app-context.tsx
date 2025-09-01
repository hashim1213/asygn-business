"use client"

import type React from "react"

import { createContext, useContext, useReducer } from "react"
import type { Worker, Shift, Staff, DashboardStats } from "@/types"

interface AppState {
  workers: Worker[]
  shifts: Shift[]
  staff: Staff[]
  stats: DashboardStats | null
  loading: {
    workers: boolean
    shifts: boolean
    staff: boolean
    stats: boolean
  }
  errors: {
    workers: string | null
    shifts: string | null
    staff: string | null
    stats: string | null
  }
}

type AppAction =
  | { type: "SET_LOADING"; payload: { key: keyof AppState["loading"]; loading: boolean } }
  | { type: "SET_ERROR"; payload: { key: keyof AppState["errors"]; error: string | null } }
  | { type: "SET_WORKERS"; payload: Worker[] }
  | { type: "SET_SHIFTS"; payload: Shift[] }
  | { type: "SET_STAFF"; payload: Staff[] }
  | { type: "SET_STATS"; payload: DashboardStats }
  | { type: "ADD_SHIFT"; payload: Shift }
  | { type: "UPDATE_SHIFT"; payload: { id: string; updates: Partial<Shift> } }
  | { type: "DELETE_SHIFT"; payload: string }
  | { type: "UPDATE_STAFF_STATUS"; payload: { id: string; status: Staff["status"] } }

const initialState: AppState = {
  workers: [],
  shifts: [],
  staff: [],
  stats: null,
  loading: {
    workers: false,
    shifts: false,
    staff: false,
    stats: false,
  },
  errors: {
    workers: null,
    shifts: null,
    staff: null,
    stats: null,
  },
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.loading,
        },
      }

    case "SET_ERROR":
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.key]: action.payload.error,
        },
      }

    case "SET_WORKERS":
      return {
        ...state,
        workers: action.payload,
        loading: { ...state.loading, workers: false },
        errors: { ...state.errors, workers: null },
      }

    case "SET_SHIFTS":
      return {
        ...state,
        shifts: action.payload,
        loading: { ...state.loading, shifts: false },
        errors: { ...state.errors, shifts: null },
      }

    case "SET_STAFF":
      return {
        ...state,
        staff: action.payload,
        loading: { ...state.loading, staff: false },
        errors: { ...state.errors, staff: null },
      }

    case "SET_STATS":
      return {
        ...state,
        stats: action.payload,
        loading: { ...state.loading, stats: false },
        errors: { ...state.errors, stats: null },
      }

    case "ADD_SHIFT":
      return {
        ...state,
        shifts: [...state.shifts, action.payload],
      }

    case "UPDATE_SHIFT":
      return {
        ...state,
        shifts: state.shifts.map((shift) =>
          shift.id === action.payload.id ? { ...shift, ...action.payload.updates } : shift,
        ),
      }

    case "DELETE_SHIFT":
      return {
        ...state,
        shifts: state.shifts.filter((shift) => shift.id !== action.payload),
      }

    case "UPDATE_STAFF_STATUS":
      return {
        ...state,
        staff: state.staff.map((member) =>
          member.id === action.payload.id ? { ...member, status: action.payload.status } : member,
        ),
      }

    default:
      return state
  }
}

interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<AppAction>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}
