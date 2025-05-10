"use client"

import { useState } from "react"
import { createAI } from "ai"
import { openai } from "@ai-sdk/openai"

export function useDaemons() {
  const [isGenerating, setIsGenerating] = useState(false)

  const generateSuggestion = async (daemon: string, text: string): Promise<string> => {
    setIsGenerating(true)

    try {
      const systemPrompt = getDaemonSystemPrompt(daemon)

      const { text: suggestion } = await createAI({
        model: openai("gpt-4o"),
        system: systemPrompt,
        prompt: text,
      })

      return suggestion
    } catch (error) {
      console.error("Error generating suggestion:", error)
      return "Failed to generate suggestion. Please try again."
    } finally {
      setIsGenerating(false)
    }
  }

  const getDaemonSystemPrompt = (daemon: string): string => {
    switch (daemon) {
      case "Devil's Advocate":
        return "You are a Devil's Advocate daemon. Your role is to challenge claims and assumptions in the text. Provide a brief, thoughtful challenge to the selected text. Be concise and specific. Your response should be 1-2 sentences only."

      case "Synthesizer":
        return "You are a Synthesizer daemon. Your role is to suggest how the selected text could be made more concise without losing meaning. Provide a brief suggestion on how to make the text more concise. Your response should be 1-2 sentences only."

      case "Complimenter":
        return "You are a Complimenter daemon. Your role is to praise strong phrasing and effective writing. Provide a brief, specific compliment about what works well in the selected text. Your response should be 1-2 sentences only."

      case "Elaborator":
        return "You are an Elaborator daemon. Your role is to suggest areas where more detail or explanation would strengthen the text. Ask a specific question that would prompt the writer to add valuable detail. Your response should be 1-2 sentences only."

      case "Researcher":
        return "You are a Researcher daemon. Your role is to suggest where a citation or evidence would strengthen the text. Provide a brief suggestion about what kind of source or evidence would support the selected text. Your response should be 1-2 sentences only."

      default:
        return "You are a helpful writing assistant. Provide a brief, constructive suggestion about the selected text. Your response should be 1-2 sentences only."
    }
  }

  return {
    generateSuggestion,
    isGenerating,
  }
}
