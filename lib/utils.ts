import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { FAQItem } from "./faq-data"

/**
 * Utility function to conditionally join class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Sanitizes user input to prevent XSS attacks
 * @param input - The user input to sanitize
 * @returns Sanitized input string
 */
export function sanitizeInput(input: string): string {
  if (!input) return ""

  // Replace potentially dangerous characters
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
}

/**
 * Normalizes text for comparison
 * @param text - The text to normalize
 * @returns Normalized text
 */
export function normalizeText(text: string): string {
  if (!text) return ""

  return text
    .toLowerCase()
    .trim()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
    .replace(/\s+/g, " ")
}

/**
 * Finds the best matching FAQ item for a query
 * @param query - The user query
 * @param faqData - Array of FAQ items
 * @returns Best matching FAQ item or null
 */
export function findBestMatch(query: string, faqData: FAQItem[]): FAQItem | null {
  if (!query || !faqData || faqData.length === 0) {
    return null
  }

  const normalizedQuery = normalizeText(query)
  let bestMatch: FAQItem | null = null
  let highestScore = 0

  for (const faqItem of faqData) {
    const normalizedQuestion = normalizeText(faqItem.question)

    // Check for exact match
    if (normalizedQuery === normalizedQuestion) {
      return faqItem
    }

    // Check if query contains the entire question
    if (normalizedQuery.includes(normalizedQuestion)) {
      const score = normalizedQuestion.length / normalizedQuery.length
      if (score > highestScore) {
        highestScore = score
        bestMatch = faqItem
      }
    }

    // Check if question contains the entire query
    if (normalizedQuestion.includes(normalizedQuery)) {
      const score = normalizedQuery.length / normalizedQuestion.length
      if (score > highestScore) {
        highestScore = score
        bestMatch = faqItem
      }
    }

    // Check for word overlap
    const queryWords = normalizedQuery.split(" ")
    const questionWords = normalizedQuestion.split(" ")
    const commonWords = queryWords.filter((word) => questionWords.includes(word))

    if (commonWords.length > 0) {
      // Calculate Jaccard similarity
      const score = commonWords.length / (queryWords.length + questionWords.length - commonWords.length)
      if (score > highestScore) {
        highestScore = score
        bestMatch = faqItem
      }
    }
  }

  // Only return a match if the score is above a threshold
  return highestScore >= 0.3 ? bestMatch : null
}

/**
 * Gets a random item from an array
 * @param items - Array of items
 * @returns Random item from the array
 */
export function getRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}
