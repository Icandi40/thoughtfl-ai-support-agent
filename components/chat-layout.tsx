"use client"

import { type ReactNode, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, Wifi, WifiOff } from "lucide-react"
import { Footer } from "@/components/footer"
import { ChatInput } from "@/components/chat-input"

interface ChatLayoutProps {
  title: string
  isOnline?: boolean
  onReset: () => void
  onSendMessage: () => void
  inputValue: string
  onInputChange: (value: string) => void
  inputDisabled?: boolean
  resetLabel?: string
  children: ReactNode
}

export function ChatLayout({
  title,
  isOnline = true,
  onReset,
  onSendMessage,
  inputValue,
  onInputChange,
  inputDisabled = false,
  resetLabel = "Reset Chat",
  children,
}: ChatLayoutProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when children change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [children])

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex items-center justify-between bg-thoughtful-navy bg-opacity-10 text-thoughtful-navy p-4 border-b border-thoughtful-navy border-opacity-10">
        <div className="flex items-center">
          <div className="w-10 h-10 mr-3 rounded-md overflow-hidden bg-gradient-brand p-[2px]">
            <div className="w-full h-full bg-thoughtful-navy rounded-[3px] flex items-center justify-center overflow-hidden">
              <img src="/thoughtful-ai-logo.png" alt="Thoughtful AI Logo" className="w-full h-full object-contain" />
            </div>
          </div>
          <h2 className="text-lg font-medium bg-clip-text text-transparent bg-gradient-brand">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          {!isOnline && (
            <div className="flex items-center text-red-600 text-sm mr-2">
              <WifiOff className="h-4 w-4 mr-1" />
              <span>Offline</span>
            </div>
          )}
          {isOnline && (
            <div className="flex items-center text-green-600 text-sm mr-2">
              <Wifi className="h-4 w-4 mr-1" />
              <span>Online</span>
            </div>
          )}
          <Button
            onClick={onReset}
            className="bg-gradient-brand hover:from-thoughtful-orange hover:to-thoughtful-purple text-white"
            aria-label={resetLabel}
            title={resetLabel}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {resetLabel}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4" role="log" aria-live="polite">
        {children}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput value={inputValue} onChange={onInputChange} onSend={onSendMessage} disabled={inputDisabled} />
      <Footer />
    </div>
  )
}
