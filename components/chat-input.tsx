"use client"

import { useState, type KeyboardEvent } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  disabled?: boolean
}

export function ChatInput({ value, onChange, onSend, disabled = false }: ChatInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      <div
        className={`flex items-end gap-2 rounded-lg border ${
          isFocused ? "border-thoughtful-coral" : "border-gray-300"
        } bg-white p-2`}
      >
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Type your message..."
          className="flex-1 resize-none bg-transparent outline-none max-h-32 min-h-10"
          rows={1}
          disabled={disabled}
          aria-label="Message input"
        />
        <Button
          onClick={onSend}
          disabled={!value.trim() || disabled}
          size="icon"
          className="bg-gradient-brand-short hover:from-thoughtful-orange hover:to-thoughtful-purple text-white h-8 w-8"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
