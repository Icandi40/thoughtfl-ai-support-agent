import { trackEvent } from "./analytics"

export interface ErrorDetails {
  message: string
  code?: string
  component?: string
  recoverable: boolean
  timestamp: Date
  context?: Record<string, any>
}

// In-memory error log (would be replaced with a real backend)
const errorLog: ErrorDetails[] = []

/**
 * Logs an error with details
 * @param error - The error object
 * @param component - The component where the error occurred
 * @param context - Additional context information
 * @returns Error details object
 */
export function logError(error: Error | string, component?: string, context?: Record<string, any>): ErrorDetails {
  const errorMessage = typeof error === "string" ? error : error.message
  const errorCode = typeof error === "string" ? undefined : (error as any).code

  const errorDetails: ErrorDetails = {
    message: errorMessage,
    code: errorCode,
    component,
    recoverable: true, // Assume recoverable by default
    timestamp: new Date(),
    context,
  }

  // Add to error log
  errorLog.push(errorDetails)

  // Track error event
  trackEvent("error", {
    message: errorMessage,
    component,
    code: errorCode,
    context,
  })

  console.error("Error logged:", errorDetails)

  return errorDetails
}

/**
 * Attempts to recover from an error
 * @param operation - Function to retry
 * @param maxRetries - Maximum number of retry attempts
 * @param delay - Delay between retries in ms
 * @param onRetry - Callback for each retry attempt
 * @returns Promise resolving to the operation result
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000,
  onRetry?: (attempt: number, error: Error) => void,
): Promise<T> {
  let lastError: Error | undefined

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error

      // Log retry attempt
      logError(lastError, "retry_operation", { attempt, maxRetries })

      if (onRetry) {
        onRetry(attempt, lastError)
      }

      // Last attempt failed, don't delay
      if (attempt === maxRetries) break

      // Wait before next retry
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  // All retries failed
  throw lastError
}

/**
 * Provides a fallback value if an operation fails
 * @param operation - Function to execute
 * @param fallbackValue - Fallback value if operation fails
 * @param component - Component name for error logging
 * @returns Result of operation or fallback value
 */
export async function withFallback<T>(operation: () => Promise<T>, fallbackValue: T, component?: string): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    logError(error as Error, component, { usedFallback: true })
    return fallbackValue
  }
}

/**
 * Gets a graceful degradation message based on error type
 * @param error - The error that occurred
 * @returns User-friendly error message
 */
export function getGracefulDegradationMessage(error: Error | string): string {
  const errorMessage = typeof error === "string" ? error : error.message

  // Network errors
  if (errorMessage.includes("network") || errorMessage.includes("fetch") || errorMessage.includes("connection")) {
    return "I'm having trouble connecting to our knowledge base. Let me try to help with what I know, or please try again in a moment."
  }

  // Timeout errors
  if (errorMessage.includes("timeout") || errorMessage.includes("timed out")) {
    return "It's taking longer than expected to process your request. Let me try a simpler approach to help you."
  }

  // Data errors
  if (errorMessage.includes("data") || errorMessage.includes("parse") || errorMessage.includes("JSON")) {
    return "I'm having trouble processing some information. Let me try to answer more generally."
  }

  // Default message
  return "I encountered a small hiccup while processing your request. Let me try to help in a different way."
}
