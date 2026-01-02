"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { cookies } from "next/headers"
import { encrypt, decrypt } from "@/lib/encryption"

export type ProposalParams = {
  jobTitle: string
  jobDescription: string
  skills: string
  experience: string
}

// Function to update the API key
export async function updateApiKey(apiKey: string) {
  try {
    // Basic format validation
    if (!apiKey.trim()) {
      return { success: false, message: "API key cannot be empty" }
    }

    // Remove any whitespace that might have been copied accidentally
    const cleanedApiKey = apiKey.trim()

    // Store the API key
    const encryptedKey = await encrypt(cleanedApiKey)

    // Clear any existing key first
    cookies().delete("openai-api-key")

    // Set the new key with proper options
    cookies().set("openai-api-key", encryptedKey, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/", // Ensure the cookie is available for all paths
    })

    return { success: true }
  } catch (error) {
    console.error("Error updating API key:", error)
    return { success: false, message: "An unexpected error occurred" }
  }
}

// Function to get the API key
async function getApiKey() {
  try {
    // First check environment variable
    if (process.env.OPENAI_API_KEY) {
      return process.env.OPENAI_API_KEY
    }

    // Then check cookie
    const apiKeyCookie = cookies().get("openai-api-key")
    if (apiKeyCookie?.value) {
      try {
        return await decrypt(apiKeyCookie.value)
      } catch (error) {
        console.error("Error decrypting API key:", error)
        // If decryption fails, delete the invalid cookie
        cookies().delete("openai-api-key")
      }
    }
  } catch (error) {
    console.error("Error getting API key:", error)
  }

  return null
}

export async function generateProposal(params: ProposalParams): Promise<string> {
  const { jobTitle, jobDescription, skills, experience } = params

  // Get the API key
  const apiKey = await getApiKey()

  // Check if OpenAI API key is configured
  if (!apiKey) {
    console.error("OpenAI API key is not configured")
    return "API_KEY_MISSING"
  }

  const prompt = `
Create a professional Upwork proposal for the following job:

Job Title: ${jobTitle}

Job Description:
${jobDescription}

My Skills:
${skills}

My Relevant Experience:
${experience}

Write a compelling, personalized proposal that:
1. Starts with a strong introduction that shows I understand their needs
2. Highlights my relevant skills and experience
3. Explains my approach to the project
4. Includes a clear call to action
5. Is professional, concise, and free of errors
6. Is between 200-300 words
7. Does NOT include generic phrases like "I am writing in response to your job posting"
8. Focuses on the client's needs rather than just talking about myself
9. Demonstrates enthusiasm without being overly casual
`

  try {
    // Add timeout to prevent hanging requests
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

    const { text } = await generateText({
      model: openai("gpt-3.5-turbo", { apiKey }),
      prompt,
      system:
        "You are an expert Upwork proposal writer who helps freelancers create compelling, personalized job proposals that win clients. Your proposals are professional, error-free, and tailored to each specific job.",
      temperature: 0.7,
      maxTokens: 500,
    })

    clearTimeout(timeoutId)
    return text
  } catch (error: any) {
    console.error("Error generating proposal:", error)

    // Check for quota exceeded errors
    if (error.message?.includes("quota") || error.message?.includes("billing") || error.message?.includes("exceeded")) {
      return "API_KEY_QUOTA_EXCEEDED"
    }

    // Check for API key related errors
    if (
      error.message?.includes("API key") ||
      error.message?.includes("authentication") ||
      error.status === 401 ||
      error.status === 403
    ) {
      // Delete the invalid API key cookie
      cookies().delete("openai-api-key")
      return "API_KEY_INVALID"
    }

    // Rate limit errors
    if (error.status === 429) {
      return "API_KEY_RATE_LIMIT"
    }

    // Provide more helpful error messages based on error type
    if (error.name === "AbortError") {
      return "Error: The request took too long to complete. Please try again or use shorter inputs."
    }

    // Return the actual error message for debugging
    return `Error: ${error.message || "Unknown error occurred"}. Please try again.`
  }
}
