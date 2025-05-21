"use client"

import { useState } from "react"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface FeedbackButtonsProps {
  messageId: string
  onFeedback: (messageId: string, isHelpful: boolean, comment?: string) => void
}

export function FeedbackButtons({ messageId, onFeedback }: FeedbackButtonsProps) {
  const [feedbackGiven, setFeedbackGiven] = useState<boolean | null>(null)
  const [showCommentBox, setShowCommentBox] = useState(false)
  const [comment, setComment] = useState("")

  const handleFeedback = (isHelpful: boolean) => {
    setFeedbackGiven(isHelpful)
    onFeedback(messageId, isHelpful)

    // Show comment box for negative feedback
    if (!isHelpful) {
      setShowCommentBox(true)
    }
  }

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      onFeedback(messageId, feedbackGiven === true, comment)
      setShowCommentBox(false)
    }
  }

  if (feedbackGiven !== null && !showCommentBox) {
    return (
      <div className="text-xs text-gray-400 mt-2">
        Thank you for your feedback!
        {feedbackGiven === false && (
          <button
            onClick={() => setShowCommentBox(true)}
            className="ml-2 bg-clip-text text-transparent bg-gradient-brand hover:opacity-80"
          >
            Tell us why
          </button>
        )}
      </div>
    )
  }

  if (showCommentBox) {
    return (
      <div className="mt-2 space-y-2">
        <Textarea
          placeholder="How can we improve this response?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="text-sm min-h-[80px] bg-gray-800 text-white border-gray-700"
        />
        <div className="flex space-x-2">
          <Button
            size="sm"
            onClick={handleCommentSubmit}
            className="bg-gradient-brand-short hover:from-thoughtful-orange hover:to-thoughtful-purple text-white"
          >
            Submit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowCommentBox(false)}
            className="text-white border-gray-700 hover:bg-gray-700"
          >
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2 mt-2">
      <span className="text-xs text-gray-400">Was this helpful?</span>
      <button
        onClick={() => handleFeedback(true)}
        className="text-gray-400 hover:text-thoughtful-coral transition-colors"
        aria-label="Helpful"
      >
        <ThumbsUp className="h-3 w-3" />
      </button>
      <button
        onClick={() => handleFeedback(false)}
        className="text-gray-400 hover:text-thoughtful-pink transition-colors"
        aria-label="Not helpful"
      >
        <ThumbsDown className="h-3 w-3" />
      </button>
    </div>
  )
}
