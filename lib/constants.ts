// Timing constants
export const CHECK_IN_TIMEOUT_MS = 300000 // 5 minutes
export const TYPING_SPEED_MIN_MS = 500 // Minimum typing time
export const TYPING_SPEED_MAX_MS = 3000 // Maximum typing time
export const TYPING_SPEED_PER_CHAR = 20 // Milliseconds per character
export const WELCOME_DELAY_MS = 500 // Delay before showing welcome message
export const RESET_WELCOME_DELAY_MS = 1000 // Delay before showing welcome message after reset

// Local storage keys
export const LS_KEY_VISITED = "thoughtful_ai_visited"

// Conversation constants
export const FAREWELL_KEYWORDS = ["bye", "goodbye", "see you", "farewell", "thanks", "thank you"]
export const FOLLOW_UP_PHRASES = [
  "tell me more",
  "more information",
  "elaborate",
  "explain further",
  "details",
  "examples",
  "what about",
  "how about",
]
export const CONTEXT_HISTORY_SIZE = 5 // Number of previous queries to keep for context

// Resource suggestions
export const RESOURCE_SUGGESTIONS = [
  "I don't have that specific information in my knowledge base. For more details, please visit our documentation at <a href='https://docs.thoughtful.ai' target='_blank' rel='noopener noreferrer'>docs.thoughtful.ai</a> or contact our support team at <a href='mailto:support@thoughtful.ai'>support@thoughtful.ai</a>.",
  "That's beyond my current knowledge. For assistance with this specific question, please reach out to our support team at <a href='mailto:support@thoughtful.ai'>support@thoughtful.ai</a> or call us at 1-800-THOUGHTFUL.",
  "I'm not able to provide that information. You can find more details about our healthcare agents on our <a href='https://www.thoughtful.ai/agents' target='_blank' rel='noopener noreferrer'>agents page</a> or by contacting our team directly.",
  "I don't have that information available. For detailed answers about this topic, please consult our <a href='https://www.thoughtful.ai/faq' target='_blank' rel='noopener noreferrer'>FAQ page</a> or contact our customer support.",
]
