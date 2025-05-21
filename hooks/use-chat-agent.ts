"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { faqData, welcomeMessages, welcomeBackMessages, checkInMessages, farewellMessages } from "@/lib/faq-data"
import { findBestMatch, getRandomItem, sanitizeInput, normalizeText } from "@/lib/utils"
import {
  CHECK_IN_TIMEOUT_MS,
  TYPING_SPEED_MIN_MS,
  TYPING_SPEED_MAX_MS,
  TYPING_SPEED_PER_CHAR,
  WELCOME_DELAY_MS,
  RESET_WELCOME_DELAY_MS,
  LS_KEY_VISITED,
  FAREWELL_KEYWORDS,
  FOLLOW_UP_PHRASES,
  CONTEXT_HISTORY_SIZE,
  RESOURCE_SUGGESTIONS,
} from "@/lib/constants"
import { enhancedFAQMatch, detectTopic, extractEntities } from "@/lib/nlp-utils"
import {
  type ConversationContext,
  createConversationContext,
  addConversationTurn,
  isFollowUpQuery,
  analyzeUserPreferences,
} from "@/lib/conversation-context"
import { trackEvent, trackQuery, trackFeedback, startSession, endSession } from "@/lib/analytics"
import { logError, retryOperation, getGracefulDegradationMessage } from "@/lib/error-recovery"

export type MessageType = "user" | "bot"

export interface Message {
  id: string
  content: string
  type: MessageType
  timestamp: Date
  feedback?: {
    helpful?: boolean
    comment?: string
  }
}

export interface FAQItem {
  question: string
  answer: string
}

/**
 * Custom hook that manages the chat agent's state and behavior
 * @returns Object containing chat state and functions
 */
export function useChatAgent() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isReturningUser, setIsReturningUser] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const lastActivityTime = useRef<Date>(new Date())
  const checkInTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const hasShownFarewell = useRef(false)
  const previousQueries = useRef<string[]>([])
  const conversationContext = useRef<ConversationContext>(createConversationContext())
  const sessionId = useRef<string>("")

  /**
   * Initialize session tracking
   */
  useEffect(() => {
    try {
      // Start analytics session
      const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : undefined
      sessionId.current = startSession(userAgent)

      // Track page view
      trackEvent("page_view", {
        sessionId: sessionId.current,
        page: "chat",
      })

      // Clean up session on unmount
      return () => {
        if (sessionId.current) {
          endSession(sessionId.current, conversationContext.current)
        }
      }
    } catch (error) {
      logError(error as Error, "session_initialization")
    }
  }, [])

  /**
   * Check if user is returning by looking at localStorage
   */
  useEffect(() => {
    try {
      const hasVisitedBefore = localStorage.getItem(LS_KEY_VISITED)
      if (hasVisitedBefore) {
        setIsReturningUser(true)
        trackEvent("returning_user")
      } else {
        localStorage.setItem(LS_KEY_VISITED, "true")
        trackEvent("new_user")
      }
    } catch (err) {
      console.error("Error accessing localStorage:", err)
      // Continue without setting returning user state
    }
  }, [])

  /**
   * Send welcome message when component mounts
   */
  useEffect(() => {
    const welcomeMessage = isReturningUser ? getRandomItem(welcomeBackMessages) : getRandomItem(welcomeMessages)

    const timer = setTimeout(() => {
      addMessage(welcomeMessage, "bot")
    }, WELCOME_DELAY_MS)

    return () => clearTimeout(timer)
  }, [isReturningUser])

  /**
   * Set up check-in timer to engage with user after period of inactivity
   */
  useEffect(() => {
    const setupCheckInTimeout = () => {
      if (checkInTimeoutRef.current) {
        clearTimeout(checkInTimeoutRef.current)
      }

      checkInTimeoutRef.current = setTimeout(() => {
        try {
          const timeSinceLastActivity = new Date().getTime() - lastActivityTime.current.getTime()

          if (timeSinceLastActivity >= CHECK_IN_TIMEOUT_MS && messages.length > 1 && !hasShownFarewell.current) {
            addMessage(getRandomItem(checkInMessages), "bot")
            trackEvent("check_in_message")
          }
        } catch (err) {
          logError(err as Error, "check_in_timeout")
        }
      }, CHECK_IN_TIMEOUT_MS)
    }

    setupCheckInTimeout()

    return () => {
      if (checkInTimeoutRef.current) {
        clearTimeout(checkInTimeoutRef.current)
      }
    }
  }, [messages])

  /**
   * Adds a new message to the chat
   * @param content - The message content
   * @param type - The message type (user or bot)
   * @returns The ID of the added message
   */
  const addMessage = useCallback((content: string, type: MessageType): string => {
    try {
      if (!content) return "" // Defensive check

      const messageId = Date.now().toString()
      const newMessage: Message = {
        id: messageId,
        content,
        type,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, newMessage])
      lastActivityTime.current = new Date()

      // Track message event
      trackEvent(type === "user" ? "user_message" : "bot_message", {
        messageId,
        contentLength: content.length,
      })

      return messageId
    } catch (err) {
      const errorDetails = logError(err as Error, "add_message")
      setError(errorDetails.recoverable ? null : (err as Error))
      return ""
    }
  }, [])

  /**
   * Updates a message with feedback
   * @param messageId - The ID of the message to update
   * @param helpful - Whether the response was helpful
   * @param comment - Optional feedback comment
   */
  const updateMessageFeedback = useCallback((messageId: string, helpful: boolean, comment?: string) => {
    try {
      setMessages((prev) =>
        prev.map((message) =>
          message.id === messageId
            ? {
                ...message,
                feedback: {
                  helpful,
                  comment,
                },
              }
            : message,
        ),
      )

      // Track feedback
      trackFeedback(messageId, helpful, comment)
    } catch (err) {
      logError(err as Error, "update_message_feedback")
    }
  }, [])

  /**
   * Simulates typing with variable speed based on message length
   * @param text - The text being "typed"
   * @returns Promise that resolves when typing is complete
   */
  const simulateTyping = useCallback((text: string): Promise<void> => {
    return new Promise<void>((resolve) => {
      try {
        setIsTyping(true)

        // Calculate typing speed based on message length
        const textLength = text?.length || 0
        const typingSpeed = Math.min(
          Math.max(textLength * TYPING_SPEED_PER_CHAR, TYPING_SPEED_MIN_MS),
          TYPING_SPEED_MAX_MS,
        )

        const timer = setTimeout(() => {
          setIsTyping(false)
          resolve()
        }, typingSpeed)

        return () => clearTimeout(timer)
      } catch (err) {
        logError(err as Error, "simulate_typing")
        setIsTyping(false)
        resolve()
      }
    })
  }, [])

  /**
   * Detects the intent of the user's message
   * @param message - The user's message
   * @returns The detected intent
   */
  const detectIntent = useCallback((message: string): string => {
    try {
      const normalizedMessage = normalizeText(message)

      // Check for farewell intent
      if (FAREWELL_KEYWORDS.some((keyword) => normalizedMessage.includes(keyword))) {
        return "farewell"
      }

      // Check for follow-up intent
      if (FOLLOW_UP_PHRASES.some((phrase) => normalizedMessage.includes(phrase))) {
        return "follow_up"
      }

      // Check for greeting intent
      if (normalizedMessage.includes("hello") || normalizedMessage.includes("hi")) {
        return "greeting"
      }

      // Check for thanks intent
      if (normalizedMessage.includes("thank")) {
        return "thanks"
      }

      // Check for help intent
      if (normalizedMessage.includes("help") || normalizedMessage.includes("assist")) {
        return "help"
      }

      // Check for contact intent
      if (
        normalizedMessage.includes("contact") ||
        normalizedMessage.includes("email") ||
        normalizedMessage.includes("phone") ||
        normalizedMessage.includes("call") ||
        normalizedMessage.includes("support")
      ) {
        return "contact"
      }

      // Default to question intent
      return "question"
    } catch (err) {
      logError(err as Error, "detect_intent")
      return "question" // Default fallback
    }
  }, [])

  /**
   * Creates a resource suggestion with contact information and links
   * @returns A formatted resource suggestion
   */
  const createResourceSuggestion = useCallback((): string => {
    try {
      // Mark that we've offered resources
      conversationContext.current.resourcesOffered = true

      // Either use a predefined suggestion or create a custom one
      if (Math.random() > 0.3) {
        return getRandomItem(RESOURCE_SUGGESTIONS)
      }

      // Create a custom resource suggestion based on the conversation context
      const topic = conversationContext.current.currentTopic || "general"
      const userPreferences = analyzeUserPreferences(conversationContext.current)

      // Track resource suggestion
      trackEvent("resource_suggestion", {
        topic,
        userPreferences,
      })

      // Customize based on user preferences and topic
      if (userPreferences.prefersDetailedResponses) {
        return "I don't have that specific information in my knowledge base. For detailed information about this topic, please visit our comprehensive documentation at <a href='https://docs.thoughtful.ai' target='_blank' rel='noopener noreferrer'>docs.thoughtful.ai</a> or contact our expert support team at <a href='mailto:support@thoughtful.ai'>support@thoughtful.ai</a>."
      }

      if (userPreferences.interestedInAgent) {
        const agent = userPreferences.interestedInAgent.toUpperCase()
        return `I don't have that specific information about ${agent}. You can learn more about ${agent} on our <a href='https://www.thoughtful.ai/agents/${agent.toLowerCase()}' target='_blank' rel='noopener noreferrer'>${agent} page</a> or contact our support team at <a href='mailto:support@thoughtful.ai'>support@thoughtful.ai</a>.`
      }

      // Default to a simple suggestion
      return "I don't have that information in my knowledge base. You can learn more on our <a href='https://www.thoughtful.ai' target='_blank' rel='noopener noreferrer'>website</a> or contact our support team at <a href='mailto:support@thoughtful.ai'>support@thoughtful.ai</a>."
    } catch (err) {
      logError(err as Error, "create_resource_suggestion")
      return "I don't have that information. Please contact our support team at support@thoughtful.ai for assistance."
    }
  }, [])

  /**
   * Generates a generic LLM response for questions not in the dataset
   * @param query - The user's query
   * @returns A generated response
   */
  const generateGenericResponse = useCallback(
    (query: string): string => {
      try {
        const intent = detectIntent(query)
        const topic = detectTopic(query)
        const entities = extractEntities(query)
        const isFollowUp = isFollowUpQuery(conversationContext.current, query)

        // Track generic response generation
        trackEvent("generic_response", {
          intent,
          topic,
          entities,
          isFollowUp,
        })

        // Check if query is about Thoughtful AI but not in our dataset
        if (query.toLowerCase().includes("thoughtful ai") || query.toLowerCase().includes("thoughtful")) {
          return createResourceSuggestion()
        }

        // Handle different intents
        switch (intent) {
          case "greeting":
            return "Hello! I'm here to help with questions about Thoughtful AI's healthcare agents. What would you like to know?"

          case "thanks":
            return "You're welcome! Is there anything else you'd like to know about Thoughtful AI's healthcare agents?"

          case "help":
            return "I can provide information about Thoughtful AI's healthcare agents like EVA (eligibility verification), CAM (claims processing), and PHIL (payment posting). What would you like to know about these agents?"

          case "contact":
            return "You can contact our support team via email at <a href='mailto:support@thoughtful.ai'>support@thoughtful.ai</a> or by phone at 1-800-THOUGHTFUL. Our team is available Monday through Friday, 9am to 5pm Eastern Time."

          case "follow_up":
            // If we have a last topic, provide more information about it
            if (conversationContext.current.currentTopic === "eligibility_verification") {
              return "EVA, our eligibility verification agent, connects with payer systems to verify patient insurance in real-time. It can check coverage details, co-pays, deductibles, and authorization requirements, significantly reducing manual work and errors."
            } else if (conversationContext.current.currentTopic === "claims_processing") {
              return "CAM, our claims processing agent, handles the entire claims lifecycle. It can validate claim information, check for errors before submission, track claim status, and even help with denial management."
            } else if (conversationContext.current.currentTopic === "payment_posting") {
              return "PHIL, our payment posting agent, automatically reconciles payments with claims, handles EOBs and ERAs, identifies underpayments, and updates your financial systems with accurate payment information."
            } else if (conversationContext.current.currentTopic === "agents") {
              return "Our AI agents work together to automate the entire revenue cycle. They're designed to integrate with your existing systems and can be customized to your specific workflows and requirements."
            } else if (conversationContext.current.currentTopic === "benefits") {
              return "The key benefits of our agents include reduced operational costs, faster reimbursements, fewer denials, improved cash flow, and allowing your staff to focus on higher-value tasks instead of routine processing."
            }

            // If we've already offered resources, provide a different response
            if (conversationContext.current.resourcesOffered) {
              return "I've shared some resources that might help. Is there something specific about our healthcare agents (EVA, CAM, or PHIL) that you'd like to know?"
            }

            // Offer resources for follow-up questions outside our knowledge base
            return createResourceSuggestion()

          default:
            // Handle based on topic
            if (topic === "eligibility_verification") {
              return "While I don't have specific information about that, I can tell you that our eligibility verification agent (EVA) automates insurance verification in real-time. Would you like to know more about EVA?"
            } else if (topic === "claims_processing") {
              return "I don't have specific details on that, but our claims processing agent (CAM) streamlines claims submission and management. Would you like to learn more about CAM?"
            } else if (topic === "payment_posting") {
              return "I don't have that specific information, but our payment posting agent (PHIL) automates payment reconciliation and posting. Would you like to know more about PHIL?"
            }

            // For questions completely outside our knowledge base, offer resources
            return createResourceSuggestion()
        }
      } catch (err) {
        const errorDetails = logError(err as Error, "generate_generic_response")

        if (errorDetails.recoverable) {
          return "I'm specifically trained on Thoughtful AI's healthcare agents. For other questions, please visit our website at https://www.thoughtful.ai or contact our support team at support@thoughtful.ai."
        } else {
          throw err // Re-throw non-recoverable errors
        }
      }
    },
    [detectIntent, createResourceSuggestion],
  )

  /**
   * Handles sending a message from the user
   */
  const handleSendMessage = useCallback(async () => {
    try {
      if (!input.trim()) return

      // Sanitize user input
      const userMessage = sanitizeInput(input.trim())
      if (!userMessage) return

      const userMessageId = addMessage(userMessage, "user")
      setInput("")
      setRetryCount(0) // Reset retry count on new message

      // Store the query for context
      previousQueries.current.push(userMessage.toLowerCase())
      if (previousQueries.current.length > CONTEXT_HISTORY_SIZE) {
        previousQueries.current.shift() // Keep only the last N queries
      }

      // Detect intent and topic
      const intent = detectIntent(userMessage)

      // Handle farewell intent
      if (intent === "farewell" && !hasShownFarewell.current) {
        hasShownFarewell.current = true
        await simulateTyping(getRandomItem(farewellMessages))
        addMessage(getRandomItem(farewellMessages), "bot")
        trackEvent("farewell")
        return
      }

      // Measure response time
      const startTime = Date.now()

      // Use retry operation for error recovery
      await retryOperation(
        async () => {
          let bestMatch: FAQItem | null = null
          let matchConfidence = 0

          // Use enhanced NLP matching
          const isFollowUp = isFollowUpQuery(conversationContext.current, userMessage)

          if (isFollowUp && conversationContext.current.lastMatchedFAQ) {
            // If it's a follow-up and we have a previous match, use that
            bestMatch = conversationContext.current.lastMatchedFAQ
            matchConfidence = 0.9 // High confidence for follow-ups
          } else {
            // Find best match using enhanced NLP
            bestMatch = enhancedFAQMatch(userMessage, faqData)

            // If no match found with enhanced NLP, try the original algorithm as fallback
            if (!bestMatch) {
              bestMatch = findBestMatch(userMessage, faqData)
            }

            // If still no match found, try combining with previous queries for context
            if (!bestMatch && previousQueries.current.length > 1) {
              const combinedQuery = previousQueries.current.slice(-2).join(" ")
              bestMatch = enhancedFAQMatch(combinedQuery, faqData)

              // If still no match, try the original algorithm
              if (!bestMatch) {
                bestMatch = findBestMatch(combinedQuery, faqData)
              }
            }

            // Estimate match confidence (simplified)
            matchConfidence = bestMatch ? 0.7 : 0
          }

          // Generate response
          let responseText: string
          if (bestMatch) {
            responseText = bestMatch.answer

            // Update conversation context
            conversationContext.current.lastMatchedFAQ = bestMatch
            conversationContext.current = addConversationTurn(
              conversationContext.current,
              userMessage,
              bestMatch.answer,
              bestMatch,
              intent,
            )
          } else {
            // Use generic LLM response for questions not in the dataset
            responseText = generateGenericResponse(userMessage)

            // Update conversation context
            conversationContext.current = addConversationTurn(
              conversationContext.current,
              userMessage,
              responseText,
              null,
              intent,
            )
          }

          // Calculate response time
          const responseTime = Date.now() - startTime

          // Track query analytics
          trackQuery(userMessage, bestMatch, matchConfidence, responseTime)

          // Simulate typing
          await simulateTyping(responseText)

          // Send response
          addMessage(responseText, "bot")
        },
        3, // Max retries
        1000, // Delay between retries
        (attempt, error) => {
          // On retry callback
          setRetryCount(attempt)
          logError(error, "message_retry", { attempt })

          // If we've retried too many times, show a degraded response
          if (attempt >= 2) {
            simulateTyping(getGracefulDegradationMessage(error)).then(() => {
              addMessage(getGracefulDegradationMessage(error), "bot")
            })
          }
        },
      )
    } catch (err) {
      const errorDetails = logError(err as Error, "send_message")
      setError(errorDetails.recoverable ? null : (err as Error))

      // Provide a fallback response
      await simulateTyping(
        "I'm sorry, I encountered an error processing your request. Please try again or contact our support team at support@thoughtful.ai.",
      )

      addMessage(
        "I'm sorry, I encountered an error processing your request. Please try again or contact our support team at support@thoughtful.ai.",
        "bot",
      )
    }
  }, [input, addMessage, simulateTyping, detectIntent, generateGenericResponse])

  /**
   * Resets the chat to its initial state
   */
  const resetChat = useCallback(() => {
    try {
      // Track reset event
      trackEvent("reset_chat", {
        messageCount: messages.length,
        conversationDuration: new Date().getTime() - conversationContext.current.sessionStartTime.getTime(),
      })

      // End current session and start a new one
      if (sessionId.current) {
        endSession(sessionId.current, conversationContext.current)
        sessionId.current = startSession(typeof navigator !== "undefined" ? navigator.userAgent : undefined)
      }

      setMessages([])
      setError(null)
      setRetryCount(0)
      hasShownFarewell.current = false
      previousQueries.current = []
      conversationContext.current = createConversationContext()

      // Send farewell message before resetting
      addMessage(getRandomItem(farewellMessages), "bot")

      // Send welcome message after a short delay
      const timer = setTimeout(() => {
        const welcomeMessage = isReturningUser ? getRandomItem(welcomeBackMessages) : getRandomItem(welcomeMessages)
        addMessage(welcomeMessage, "bot")
      }, RESET_WELCOME_DELAY_MS)

      return () => clearTimeout(timer)
    } catch (err) {
      const errorDetails = logError(err as Error, "reset_chat")
      setError(errorDetails.recoverable ? null : (err as Error))
    }
  }, [isReturningUser, addMessage])

  return {
    messages,
    input,
    setInput,
    handleSendMessage,
    isTyping,
    resetChat,
    error,
    retryCount,
    updateMessageFeedback,
  }
}
