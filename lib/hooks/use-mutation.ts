"use client"

import { useState, useCallback } from "react"

interface MutationOptions<TData, TVariables> {
  onSuccess?: (data: TData, variables: TVariables) => void
  onError?: (error: string, variables: TVariables) => void
  onSettled?: (data: TData | null, error: string | null, variables: TVariables) => void
}

interface MutationResult<TData, TVariables> {
  mutate: (variables: TVariables) => Promise<TData | null>
  mutateAsync: (variables: TVariables) => Promise<TData>
  data: TData | null
  loading: boolean
  error: string | null
  reset: () => void
}

export function useMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<{ data: TData; success: boolean; error?: string }>,
  options: MutationOptions<TData, TVariables> = {},
): MutationResult<TData, TVariables> {
  const [data, setData] = useState<TData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { onSuccess, onError, onSettled } = options

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  const mutate = useCallback(
    async (variables: TVariables): Promise<TData | null> => {
      setLoading(true)
      setError(null)

      try {
        const result = await mutationFn(variables)

        if (result.success) {
          setData(result.data)
          onSuccess?.(result.data, variables)
          onSettled?.(result.data, null, variables)
          return result.data
        } else {
          const errorMessage = result.error || "Unknown error"
          setError(errorMessage)
          onError?.(errorMessage, variables)
          onSettled?.(null, errorMessage, variables)
          return null
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error"
        setError(errorMessage)
        onError?.(errorMessage, variables)
        onSettled?.(null, errorMessage, variables)
        return null
      } finally {
        setLoading(false)
      }
    },
    [mutationFn, onSuccess, onError, onSettled],
  )

  const mutateAsync = useCallback(
    async (variables: TVariables): Promise<TData> => {
      const result = await mutate(variables)
      if (result === null) {
        throw new Error(error || "Mutation failed")
      }
      return result
    },
    [mutate, error],
  )

  return {
    mutate,
    mutateAsync,
    data,
    loading,
    error,
    reset,
  }
}
