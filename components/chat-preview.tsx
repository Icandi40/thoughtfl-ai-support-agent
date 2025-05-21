"use client"

import { useState, useRef, useEffect } from "react"
import { ChatMessage } from "@/components/chat-message"
import { TypingIndicator } from "@/components/typing-indicator"
import { SuggestedQuestions } from "@/components/suggested-questions"
import { ChatLayout } from "@/components/chat-layout"

// Sample messages for preview mode
const sampleMessages = [
  {
    id: "1",
    content: "Hello! I'm the Thoughtful AI Support Agent. How can I help you today?",
    type: "bot" as const,
    timestamp: new Date(),
  },
  {
    id: "2",
    content: "What can you tell me about EVA?",
    type: "user" as const,
    timestamp: new Date(),
  },
  {
    id: "3",
    content:
      "EVA (Eligibility Verification Agent) is our AI solution that automates insurance eligibility verification. It connects with payer systems to verify patient insurance in real-time, checking coverage details, co-pays, deductibles, and authorization requirements. This significantly reduces manual work and errors in the verification process.",
    type: "bot" as const,
    timestamp: new Date(),
  },
]

export function ChatPreview() {
  const [messages, setMessages] = useState(sampleMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isOnline, setIsOnline] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      content: input.trim(),
      type: "user" as const,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate typing
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)

      // Add bot response
      const botMessage = {
        id: (Date.now() + 1).toString(),
        content: "This is a preview mode. In the actual application, you would receive a real response here.",
        type: "bot" as const,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    }, 1500)
  }

  const resetChat = () => {
    setMessages(sampleMessages)
  }

  const handleSelectQuestion = (question: string) => {
    setInput(question)
  }

  return (
    <ChatLayout
      title="Preview Mode"
      isOnline={isOnline}
      onReset={resetChat}
      onSendMessage={handleSendMessage}
      inputValue={input}
      onInputChange={setInput}
      inputDisabled={!isOnline}
      resetLabel="Reset Preview"
    >
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      {isTyping && <TypingIndicator />}
      {messages.length <= 3 && (
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">You can ask about:</p>
          <SuggestedQuestions onSelectQuestion={handleSelectQuestion} />
        </div>
      )}
      <div ref={messagesEndRef} />
    </ChatLayout>
  )
}
