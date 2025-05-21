import type { FAQItem } from "./faq-data"
import { detectTopic, extractEntities } from "./nlp-utils"

export interface ConversationTurn {
  query: string
  response: string
  matchedFAQ: FAQItem | null
  timestamp: Date
  intent: string
  topic: string
  entities: Record<string, string[]>
}

export interface ConversationContext {
  turns: ConversationTurn[]
  currentTopic?: string
  previousTopics: string[]
  lastMatchedFAQ?: FAQItem | null
  userPreferences: Record<string, any>
  sessionStartTime: Date
  resourcesOffered: boolean
}

/**
 * Creates a new conversation context
 * @returns A new conversation context object
 */
export function createConversationContext(): ConversationContext {
  return {
    turns: [],
    previousTopics: [],
    userPreferences: {},
    sessionStartTime: new Date(),
    resourcesOffered: false,
  }
}

/**
 * Adds a new turn to the conversation context
 * @param context - The conversation context
 * @param query - The user query
 * @param response - The bot response
 * @param matchedFAQ - The matched FAQ item, if any
 * @param intent - The detected intent
 * @returns Updated conversation context
 */
export function addConversationTurn(
  context: ConversationContext,
  query: string,
  response: string,
  matchedFAQ: FAQItem | null,
  intent: string,
): ConversationContext {
  const topic = detectTopic(query)
  const entities = extractEntities(query)

  const newTurn: ConversationTurn = {
    query,
    response,
    matchedFAQ,
    timestamp: new Date(),
    intent,
    topic,
    entities,
  }

  // Update context
  const updatedContext = { ...context }
  updatedContext.turns = [...context.turns, newTurn]

  // Update current topic if it's a substantive query
  if (intent !== "greeting" && intent !== "farewell" && intent !== "thanks") {
    if (context.currentTopic && context.currentTopic !== topic) {
      updatedContext.previousTopics = [...context.previousTopics, context.currentTopic]
    }
    updatedContext.currentTopic = topic
  }

  // Update last matched FAQ
  if (matchedFAQ) {
    updatedContext.lastMatchedFAQ = matchedFAQ
  }

  return updatedContext
}

/**
 * Gets the conversation history as a formatted string
 * @param context - The conversation context
 * @param maxTurns - Maximum number of turns to include
 * @returns Formatted conversation history
 */
export function getConversationHistory(context: ConversationContext, maxTurns = 5): string {
  const recentTurns = context.turns.slice(-maxTurns)

  return recentTurns.map((turn) => `User: ${turn.query}\nBot: ${turn.response}`).join("\n\n")
}

/**
 * Determines if the current conversation is a follow-up to a previous topic
 * @param context - The conversation context
 * @param query - The current query
 * @returns Boolean indicating if this is a follow-up
 */
export function isFollowUpQuery(context: ConversationContext, query: string): boolean {
  if (context.turns.length === 0) return false

  const lowercaseQuery = query.toLowerCase()
  const followUpPhrases = [
    "tell me more",
    "more information",
    "elaborate",
    "explain further",
    "details",
    "examples",
    "what about",
    "how about",
    "and",
    "also",
    "too",
    "as well",
  ]

  // Check for explicit follow-up phrases
  if (followUpPhrases.some((phrase) => lowercaseQuery.includes(phrase))) {
    return true
  }

  // Check for very short queries that likely depend on context
  if (query.split(/\s+/).length <= 3 && context.turns.length > 0) {
    return true
  }

  // Check for pronouns referring to previous topics
  const pronouns = ["it", "this", "that", "they", "them", "these", "those"]
  if (pronouns.some((pronoun) => new RegExp(`\\b${pronoun}\\b`).test(lowercaseQuery))) {
    return true
  }

  return false
}

/**
 * Gets related topics based on conversation history
 * @param context - The conversation context
 * @returns Array of related topics
 */
export function getRelatedTopics(context: ConversationContext): string[] {
  const allTopics = context.turns.map((turn) => turn.topic).filter((topic) => topic !== "general")

  // Get unique topics
  return Array.from(new Set(allTopics))
}

/**
 * Analyzes the conversation to determine user preferences
 * @param context - The conversation context
 * @returns Updated user preferences
 */
export function analyzeUserPreferences(context: ConversationContext): Record<string, any> {
  const preferences: Record<string, any> = { ...context.userPreferences }

  // Analyze query patterns
  const queries = context.turns.map((turn) => turn.query.toLowerCase())

  // Check for preference for detailed responses
  const detailPhrases = ["detail", "explain", "elaborate", "more", "specific"]
  const detailCount = queries.filter((query) => detailPhrases.some((phrase) => query.includes(phrase))).length

  if (detailCount >= 2) {
    preferences.prefersDetailedResponses = true
  }

  // Check for preference for specific agents
  const agentMentions = context.turns.flatMap((turn) => turn.entities.agents)
  const agentCounts: Record<string, number> = {}

  for (const agent of agentMentions) {
    agentCounts[agent] = (agentCounts[agent] || 0) + 1
  }

  const mostMentionedAgent = Object.entries(agentCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([agent]) => agent)[0]

  if (mostMentionedAgent) {
    preferences.interestedInAgent = mostMentionedAgent
  }

  return preferences
}
