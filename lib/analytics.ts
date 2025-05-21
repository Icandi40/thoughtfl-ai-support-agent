import type { FAQItem } from "./faq-data"
import type { ConversationContext } from "./conversation-context"

export interface AnalyticsEvent {
  type: string
  timestamp: Date
  data: Record<string, any>
}

export interface QueryAnalytics {
  query: string
  matchedFAQ: FAQItem | null
  matchConfidence: number
  responseTime: number
  helpful?: boolean
  feedback?: string
  timestamp: Date
}

export interface SessionAnalytics {
  sessionId: string
  startTime: Date
  endTime?: Date
  queries: QueryAnalytics[]
  userAgent?: string
  conversationLength: number
  topicsDiscussed: string[]
}

// In-memory storage for analytics (would be replaced with a real backend)
const analyticsEvents: AnalyticsEvent[] = []
const queriesAnalytics: QueryAnalytics[] = []
const sessionsAnalytics: SessionAnalytics[] = []

/**
 * Tracks an analytics event
 * @param type - Event type
 * @param data - Event data
 */
export function trackEvent(type: string, data: Record<string, any> = {}): void {
  try {
    const event: AnalyticsEvent = {
      type,
      timestamp: new Date(),
      data,
    }

    analyticsEvents.push(event)

    // In a real implementation, this would send the event to a backend
    console.log("Analytics event:", event)
  } catch (error) {
    console.error("Error tracking analytics event:", error)
  }
}

/**
 * Tracks a user query and its response
 * @param query - The user query
 * @param matchedFAQ - The matched FAQ item, if any
 * @param matchConfidence - The confidence score of the match
 * @param responseTime - Time taken to generate response in ms
 */
export function trackQuery(
  query: string,
  matchedFAQ: FAQItem | null,
  matchConfidence: number,
  responseTime: number,
): string {
  try {
    const queryId = Date.now().toString()

    const queryAnalytics: QueryAnalytics = {
      query,
      matchedFAQ,
      matchConfidence,
      responseTime,
      timestamp: new Date(),
    }

    queriesAnalytics.push(queryAnalytics)

    trackEvent("query", {
      queryId,
      query,
      matchedFAQId: matchedFAQ?.question,
      matchConfidence,
      responseTime,
    })

    return queryId
  } catch (error) {
    console.error("Error tracking query:", error)
    return ""
  }
}

/**
 * Tracks feedback for a query
 * @param queryId - The query ID
 * @param helpful - Whether the response was helpful
 * @param feedback - Optional feedback text
 */
export function trackFeedback(queryId: string, helpful: boolean, feedback?: string): void {
  try {
    const queryIndex = queriesAnalytics.findIndex((q) => q.timestamp.getTime().toString() === queryId)

    if (queryIndex >= 0) {
      queriesAnalytics[queryIndex].helpful = helpful
      if (feedback) {
        queriesAnalytics[queryIndex].feedback = feedback
      }
    }

    trackEvent("feedback", {
      queryId,
      helpful,
      feedback,
    })
  } catch (error) {
    console.error("Error tracking feedback:", error)
  }
}

/**
 * Starts tracking a new session
 * @param userAgent - Optional user agent string
 * @returns Session ID
 */
export function startSession(userAgent?: string): string {
  try {
    const sessionId = Date.now().toString()

    const session: SessionAnalytics = {
      sessionId,
      startTime: new Date(),
      queries: [],
      userAgent,
      conversationLength: 0,
      topicsDiscussed: [],
    }

    sessionsAnalytics.push(session)

    trackEvent("session_start", {
      sessionId,
      userAgent,
    })

    return sessionId
  } catch (error) {
    console.error("Error starting session:", error)
    return ""
  }
}

/**
 * Ends a tracking session
 * @param sessionId - The session ID
 * @param context - The conversation context
 */
export function endSession(sessionId: string, context: ConversationContext): void {
  try {
    const sessionIndex = sessionsAnalytics.findIndex((s) => s.sessionId === sessionId)

    if (sessionIndex >= 0) {
      const session = sessionsAnalytics[sessionIndex]
      session.endTime = new Date()
      session.conversationLength = context.turns.length
      session.topicsDiscussed = Array.from(new Set(context.turns.map((turn) => turn.topic)))

      // Add queries to session
      const sessionStartTime = session.startTime.getTime()
      const sessionEndTime = session.endTime.getTime()

      session.queries = queriesAnalytics.filter((q) => {
        const queryTime = q.timestamp.getTime()
        return queryTime >= sessionStartTime && queryTime <= sessionEndTime
      })
    }

    trackEvent("session_end", {
      sessionId,
      duration:
        sessionsAnalytics[sessionIndex]?.endTime?.getTime() - sessionsAnalytics[sessionIndex]?.startTime.getTime(),
      queryCount: sessionsAnalytics[sessionIndex]?.queries.length,
    })
  } catch (error) {
    console.error("Error ending session:", error)
  }
}

/**
 * Gets FAQ improvement suggestions based on analytics
 * @returns Array of improvement suggestions
 */
export function getFAQImprovementSuggestions(): Array<{
  query: string
  count: number
  suggestion: string
}> {
  try {
    // Find queries with no matches or unhelpful responses
    const unmatchedQueries = queriesAnalytics.filter((q) => !q.matchedFAQ || q.helpful === false)

    // Group by query text
    const queryGroups: Record<string, QueryAnalytics[]> = {}

    for (const query of unmatchedQueries) {
      const normalizedQuery = query.query.toLowerCase().trim()
      if (!queryGroups[normalizedQuery]) {
        queryGroups[normalizedQuery] = []
      }
      queryGroups[normalizedQuery].push(query)
    }

    // Generate suggestions
    return Object.entries(queryGroups)
      .filter(([_, queries]) => queries.length >= 2) // Only suggest for repeated queries
      .map(([queryText, queries]) => ({
        query: queryText,
        count: queries.length,
        suggestion: queries.some((q) => q.feedback)
          ? `Add FAQ for "${queryText}". User feedback: ${queries.find((q) => q.feedback)?.feedback}`
          : `Add FAQ for "${queryText}" which was asked ${queries.length} times without a good match`,
      }))
      .sort((a, b) => b.count - a.count)
  } catch (error) {
    console.error("Error generating FAQ suggestions:", error)
    return []
  }
}
