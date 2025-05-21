"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logError } from "@/lib/error-recovery"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * Error boundary component to catch and handle errors in the component tree
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to our error tracking system
    logError(error, "error_boundary", { errorInfo: errorInfo.componentStack })
    console.error("Error caught by ErrorBoundary:", error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
    // Force a refresh of the page
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      // Render custom fallback UI if provided, otherwise use default
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-red-50">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-red-700 mb-2">Something went wrong</h2>
          <p className="text-red-600 mb-4">
            {this.state.error?.message || "An unexpected error occurred in the application."}
          </p>
          <Button onClick={this.handleReset} variant="destructive">
            Reset Application
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
