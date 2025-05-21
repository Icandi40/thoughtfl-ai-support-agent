"use client"

import { useRef, useEffect, useState } from "react"
import { useChatAgent } from "@/hooks/use-chat-agent"
import { ChatMessage } from "@/components/chat-message"
import { TypingIndicator } from "@/components/typing-indicator"
import { SuggestedQuestions } from "@/components/suggested-questions"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChatLayout } from "@/components/chat-layout"
import { trackEvent } from "@/lib/analytics"

export function ChatInterface() {
  const {
    messages,
    input,
    setInput,
    handleSendMessage,
    isTyping,
    resetChat,
    error,
    retryCount,
    updateMessageFeedback,
  } = useChatAgent()
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [isOnline, setIsOnline] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  // Hide suggestions after user sends a message
  useEffect(() => {
    if (messages.length > 1) {
      setShowSuggestions(false)
    }
  }, [messages])

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      trackEvent("online_status_change", { status: "online" })
    }

    const handleOffline = () => {
      setIsOnline(false)
      trackEvent("online_status_change", { status: "offline" })
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Set initial status
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const handleSelectQuestion = (question: string) => {
    if (!question) return // Defensive check
    setInput(question)
    setShowSuggestions(false)
    trackEvent("suggested_question_selected", { question })
  }

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Reset chat with Alt+R
      if (e.altKey && e.key === "r") {
        resetChat()
        trackEvent("keyboard_shortcut", { shortcut: "alt+r", action: "reset_chat" })
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [resetChat])

  // Show error state if there's an error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-red-50">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-red-700 mb-2">Something went wrong</h2>
        <p className="text-red-600 mb-4">{error.message || "An error occurred in the chat interface."}</p>
        <Button onClick={resetChat} variant="destructive">
          Reset Chat
        </Button>
      </div>
    )
  }

  // Render chat content
  const renderChatContent = () => (
    <>
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} onFeedback={updateMessageFeedback} />
      ))}
      {isTyping && <TypingIndicator />}
      {retryCount > 0 && (
        <div className="text-xs text-yellow-500 mb-4">Having trouble connecting... Retry attempt {retryCount}/3</div>
      )}
      {showSuggestions && messages.length <= 1 && (
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">You can ask about:</p>
          <SuggestedQuestions onSelectQuestion={handleSelectQuestion} />
        </div>
      )}
      <div ref={messagesEndRef} />
    </>
  )

  return (
    <ChatLayout
      title="Support Chat"
      isOnline={isOnline}
      onReset={resetChat}
      onSendMessage={handleSendMessage}
      inputValue={input}
      onInputChange={setInput}
      inputDisabled={!isOnline}
      resetLabel="Reset Chat"
    >
      {renderChatContent()}
    </ChatLayout>
  )
}
