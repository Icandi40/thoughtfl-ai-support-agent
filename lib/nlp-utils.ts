import type { FAQItem } from "./faq-data"

// Simple English stopwords list
const STOPWORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "but",
  "in",
  "on",
  "at",
  "to",
  "for",
  "with",
  "by",
  "about",
  "as",
  "of",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "shall",
  "should",
  "can",
  "could",
  "may",
  "might",
  "must",
  "i",
  "you",
  "he",
  "she",
  "it",
  "we",
  "they",
  "me",
  "him",
  "her",
  "us",
  "them",
  "my",
  "your",
  "his",
  "its",
  "our",
  "their",
  "this",
  "that",
  "these",
  "those",
])

/**
 * Tokenizes text into words, removing stopwords and punctuation
 * @param text - The text to tokenize
 * @returns Array of tokens
 */
export function tokenize(text: string): string[] {
  if (!text) return []

  // Convert to lowercase and remove punctuation
  const cleanText = text.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")

  // Split into words and filter out stopwords and short words
  return cleanText.split(/\s+/).filter((word) => word.length > 2 && !STOPWORDS.has(word))
}

/**
 * Performs simple stemming on a word (simplified Porter stemming)
 * @param word - The word to stem
 * @returns The stemmed word
 */
export function stemWord(word: string): string {
  if (!word || word.length < 3) return word

  let result = word.toLowerCase()

  // Remove common endings
  if (result.endsWith("ing")) result = result.slice(0, -3)
  else if (result.endsWith("ed")) result = result.slice(0, -2)
  else if (result.endsWith("s") && !result.endsWith("ss")) result = result.slice(0, -1)
  else if (result.endsWith("ly")) result = result.slice(0, -2)
  else if (result.endsWith("ment")) result = result.slice(0, -4)
  else if (result.endsWith("ness")) result = result.slice(0, -4)
  else if (result.endsWith("ity")) result = result.slice(0, -3)
  else if (result.endsWith("tion")) result = result.slice(0, -4)

  return result
}

/**
 * Stems all words in a text
 * @param text - The text to stem
 * @returns The stemmed text
 */
export function stemText(text: string): string {
  const tokens = tokenize(text)
  return tokens.map((token) => stemWord(token)).join(" ")
}

/**
 * Calculates term frequency (TF) for a term in a document
 * @param term - The term to calculate frequency for
 * @param document - The document text
 * @returns The term frequency
 */
export function calculateTF(term: string, document: string): number {
  const tokens = tokenize(document)
  if (tokens.length === 0) return 0

  const termCount = tokens.filter((token) => token === term).length
  return termCount / tokens.length
}

/**
 * Calculates inverse document frequency (IDF) for a term across documents
 * @param term - The term to calculate IDF for
 * @param documents - Array of document texts
 * @returns The IDF value
 */
export function calculateIDF(term: string, documents: string[]): number {
  if (!documents.length) return 0

  const documentsWithTerm = documents.filter((doc) => tokenize(doc).includes(term)).length

  // Add 1 to avoid division by zero
  return Math.log(documents.length / (documentsWithTerm + 1))
}

/**
 * Calculates TF-IDF score for a term in a document
 * @param term - The term to calculate TF-IDF for
 * @param document - The document text
 * @param documents - Array of all document texts
 * @returns The TF-IDF score
 */
export function calculateTFIDF(term: string, document: string, documents: string[]): number {
  return calculateTF(term, document) * calculateIDF(term, documents)
}

/**
 * Extracts entities from text (simplified version)
 * @param text - The text to extract entities from
 * @returns Object with extracted entities
 */
export function extractEntities(text: string): Record<string, string[]> {
  const entities: Record<string, string[]> = {
    agents: [],
    healthcare: [],
    actions: [],
  }

  const lowercaseText = text.toLowerCase()

  // Extract agent names
  if (lowercaseText.includes("eva")) entities.agents.push("eva")
  if (lowercaseText.includes("cam")) entities.agents.push("cam")
  if (lowercaseText.includes("phil")) entities.agents.push("phil")

  // Extract healthcare terms
  const healthcareTerms = [
    "patient",
    "hospital",
    "clinic",
    "doctor",
    "healthcare",
    "medical",
    "insurance",
    "claim",
    "billing",
    "reimbursement",
    "eligibility",
  ]

  for (const term of healthcareTerms) {
    if (lowercaseText.includes(term)) entities.healthcare.push(term)
  }

  // Extract action verbs
  const actionVerbs = [
    "help",
    "explain",
    "tell",
    "show",
    "find",
    "get",
    "need",
    "want",
    "looking for",
    "searching",
    "how to",
    "how do",
  ]

  for (const verb of actionVerbs) {
    if (lowercaseText.includes(verb)) entities.actions.push(verb)
  }

  return entities
}

/**
 * Calculates semantic similarity between two texts using TF-IDF
 * @param text1 - First text
 * @param text2 - Second text
 * @param allDocuments - Array of all documents for IDF calculation
 * @returns Similarity score between 0 and 1
 */
export function calculateSemanticSimilarity(text1: string, text2: string, allDocuments: string[]): number {
  const tokens1 = tokenize(text1)
  const tokens2 = tokenize(text2)

  if (tokens1.length === 0 || tokens2.length === 0) return 0

  // Get unique terms from both texts
  const uniqueTerms = Array.from(new Set([...tokens1, ...tokens2]))

  // Calculate TF-IDF vectors
  const vector1: number[] = []
  const vector2: number[] = []

  for (const term of uniqueTerms) {
    vector1.push(calculateTFIDF(term, text1, allDocuments))
    vector2.push(calculateTFIDF(term, text2, allDocuments))
  }

  // Calculate cosine similarity
  let dotProduct = 0
  let magnitude1 = 0
  let magnitude2 = 0

  for (let i = 0; i < uniqueTerms.length; i++) {
    dotProduct += vector1[i] * vector2[i]
    magnitude1 += vector1[i] * vector1[i]
    magnitude2 += vector2[i] * vector2[i]
  }

  magnitude1 = Math.sqrt(magnitude1)
  magnitude2 = Math.sqrt(magnitude2)

  if (magnitude1 === 0 || magnitude2 === 0) return 0

  return dotProduct / (magnitude1 * magnitude2)
}

/**
 * Detects the topic of a text using keyword analysis
 * @param text - The text to analyze
 * @returns The detected topic
 */
export function detectTopic(text: string): string {
  const entities = extractEntities(text)
  const lowercaseText = text.toLowerCase()

  // Check for specific agent questions
  if (
    entities.agents.includes("eva") ||
    lowercaseText.includes("eligibility") ||
    lowercaseText.includes("verification")
  ) {
    return "eligibility_verification"
  }

  if (entities.agents.includes("cam") || lowercaseText.includes("claim") || lowercaseText.includes("claims")) {
    return "claims_processing"
  }

  if (entities.agents.includes("phil") || lowercaseText.includes("payment") || lowercaseText.includes("posting")) {
    return "payment_posting"
  }

  // Check for general topics
  if (entities.agents.length > 0 || lowercaseText.includes("agent")) {
    return "agents"
  }

  if (lowercaseText.includes("benefit") || lowercaseText.includes("advantage")) {
    return "benefits"
  }

  if (lowercaseText.includes("price") || lowercaseText.includes("cost") || lowercaseText.includes("pricing")) {
    return "pricing"
  }

  if (lowercaseText.includes("contact") || lowercaseText.includes("support") || lowercaseText.includes("help")) {
    return "contact"
  }

  // Default to general topic
  return "general"
}

/**
 * Enhanced FAQ matching using NLP techniques
 * @param query - User query
 * @param faqData - Array of FAQ items
 * @returns Best matching FAQ item or null
 */
export function enhancedFAQMatch(query: string, faqData: FAQItem[]): FAQItem | null {
  if (!query || !faqData || faqData.length === 0) {
    return null
  }

  // Prepare documents for TF-IDF calculation
  const allDocuments = faqData.map(
    (item) => `${item.question} ${item.answer} ${item.alternativeQuestions?.join(" ") || ""}`,
  )

  // Add the query to the documents
  allDocuments.push(query)

  // Extract entities from query
  const queryEntities = extractEntities(query)

  // Detect query topic
  const queryTopic = detectTopic(query)

  let bestMatch: FAQItem | null = null
  let highestScore = 0

  for (const faqItem of faqData) {
    let score = 0

    // Calculate semantic similarity between query and question
    const questionSimilarity = calculateSemanticSimilarity(query, faqItem.question, allDocuments)
    score += questionSimilarity * 40

    // Check for entity matches
    const faqEntities = extractEntities(faqItem.question + " " + faqItem.answer)

    // Agent match
    const agentMatch = queryEntities.agents.some((agent) => faqEntities.agents.includes(agent))
    if (agentMatch) score += 15

    // Healthcare term match
    const healthcareMatch = queryEntities.healthcare.some((term) => faqEntities.healthcare.includes(term))
    if (healthcareMatch) score += 10

    // Topic match
    const faqTopic = faqItem.category?.toLowerCase() || detectTopic(faqItem.question)
    if (queryTopic === faqTopic) score += 20

    // Check alternative questions
    if (faqItem.alternativeQuestions) {
      for (const altQuestion of faqItem.alternativeQuestions) {
        const altSimilarity = calculateSemanticSimilarity(query, altQuestion, allDocuments)
        score += altSimilarity * 30
      }
    }

    // Check for exact matches after stemming
    const stemmedQuery = stemText(query)
    const stemmedQuestion = stemText(faqItem.question)

    if (stemmedQuery === stemmedQuestion) {
      score += 50
    }

    // Update best match if score is higher
    if (score > highestScore) {
      highestScore = score
      bestMatch = faqItem
    }
  }

  // Only return a match if the score is above a threshold
  return highestScore >= 15 ? bestMatch : null
}
