import { NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { apiKey } = await request.json()

    if (!apiKey || typeof apiKey !== "string") {
      return NextResponse.json({ success: false, error: "Invalid API key format" }, { status: 400 })
    }

    try {
      // Make a minimal API call to verify the key
      const { text } = await generateText({
        model: openai("gpt-3.5-turbo", { apiKey }),
        prompt: "Hello",
        maxTokens: 5,
      })

      return NextResponse.json({
        success: true,
        message: "API key is valid",
        sample: text,
      })
    } catch (error: any) {
      console.error("API verification error:", error)

      // Check for quota exceeded errors - consider the key valid but with quota issues
      if (
        error.message?.includes("quota") ||
        error.message?.includes("billing") ||
        error.message?.includes("exceeded")
      ) {
        return NextResponse.json({
          success: true, // Still mark as success since the key format is valid
          quotaExceeded: true,
          message: "API key is valid but has exceeded its quota",
          error: error.message,
        })
      }

      // Return detailed error information for debugging
      return NextResponse.json({
        success: false,
        error: error.message || "Unknown error",
        code: error.status || error.code || "unknown",
        type: error.type || "unknown",
      })
    }
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 })
  }
}
