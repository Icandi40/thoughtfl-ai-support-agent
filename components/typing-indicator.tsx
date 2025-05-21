"use client"

export function TypingIndicator() {
  return (
    <div className="flex w-full mb-4 justify-start">
      <div className="bg-thoughtful-navy text-white rounded-lg p-4 rounded-tl-none max-w-[80%]">
        <div className="flex space-x-2">
          <div
            className="w-2 h-2 rounded-full animate-bounce"
            style={{
              animationDelay: "0ms",
              background: "linear-gradient(to right, #FF5C00, #FF5C35)",
            }}
          />
          <div
            className="w-2 h-2 rounded-full animate-bounce"
            style={{
              animationDelay: "150ms",
              background: "linear-gradient(to right, #FF5C35, #E91E63)",
            }}
          />
          <div
            className="w-2 h-2 rounded-full animate-bounce"
            style={{
              animationDelay: "300ms",
              background: "linear-gradient(to right, #E91E63, #9C27B0)",
            }}
          />
        </div>
      </div>
    </div>
  )
}
