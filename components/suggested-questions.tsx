"use client"

import { Button } from "@/components/ui/button"

interface SuggestedQuestionsProps {
  onSelectQuestion: (question: string) => void
}

export function SuggestedQuestions({ onSelectQuestion }: SuggestedQuestionsProps) {
  const questions = [
    "What is Thoughtful AI?",
    "Tell me about EVA",
    "How does CAM work?",
    "What is PHIL?",
    "What are the benefits of using your agents?",
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {questions.map((question) => (
        <Button
          key={question}
          variant="outline"
          size="sm"
          className="text-xs bg-white hover:bg-gray-100 border-thoughtful-coral hover:border-thoughtful-pink"
          onClick={() => onSelectQuestion(question)}
        >
          {question}
        </Button>
      ))}
    </div>
  )
}
