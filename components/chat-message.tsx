"use client"

import type { Message } from "@/hooks/use-chat-agent"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { FeedbackButtons } from "./feedback-buttons"

interface ChatMessageProps {
  message: Message
  onFeedback?: (messageId: string, isHelpful: boolean, comment?: string) => void
}

/**
 * Component to display a chat message
 * Supports rendering safe HTML links for resource suggestions
 */
export function ChatMessage({ message, onFeedback }: ChatMessageProps) {
  const isBot = message.type === "bot"
  const formattedTime = message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  const [showLinks, setShowLinks] = useState(true)

  // Function to safely render HTML content (only for bot messages with links)
  const renderMessageContent = () => {
    if (!isBot || !message.content.includes("<a href=")) {
      return <p className="whitespace-pre-wrap text-white">{message.content}</p>
    }

    // For bot messages with links, render the HTML
    return (
      <div className="text-white">
        {showLinks ? (
          <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: message.content }} />
        ) : (
          <p className="whitespace-pre-wrap">
            {message.content.replace(/<a\s+(?:[^>]*?\s+)?href=(["])(.*?)\1[^>]*>(.*?)<\/a>/g, "$3")}
          </p>
        )}
        <button
          onClick={() => setShowLinks(!showLinks)}
          className="text-xs underline mt-1 text-thoughtful-coral hover:text-thoughtful-pink"
        >
          {showLinks ? "Hide links" : "Show links"}
        </button>
      </div>
    )
  }

  return (
    <div
      className={cn("flex w-full mb-4", isBot ? "justify-start" : "justify-end")}
      role="listitem"
      aria-label={`${isBot ? "Agent" : "You"} said at ${formattedTime}`}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg p-4",
          isBot ? "bg-thoughtful-navy text-white rounded-tl-none" : "bg-gray-700 text-white rounded-tr-none",
        )}
      >
        {renderMessageContent()}
        <div className={cn("text-xs mt-1", isBot ? "text-thoughtful-coral" : "text-gray-300")}>
          <time dateTime={message.timestamp.toISOString()}>{formattedTime}</time>
        </div>

        {/* Only show feedback buttons for bot messages */}
        {isBot && onFeedback && !message.feedback && <FeedbackButtons messageId={message.id} onFeedback={onFeedback} />}

        {/* Show feedback result if already given */}
        {isBot && message.feedback && (
          <div className="text-xs text-gray-400 mt-2">
            {message.feedback.helpful
              ? "Thanks for your positive feedback!"
              : "Thanks for your feedback. We'll work to improve this response."}
          </div>
        )}
      </div>
    </div>
  )
}
