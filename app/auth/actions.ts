"use server"

import { cookies } from "next/headers"
import { encrypt, decrypt } from "@/lib/encryption"

// Types
type LoginParams = {
  email: string
  password: string
}

type SignupParams = {
  name: string
  email: string
  password: string
}

type User = {
  id: string
  name: string
  email: string
}

// In a real app, this would be a database call
// For this demo, we'll use a simple in-memory store
const DEMO_USERS = [
  {
    id: "1",
    name: "Demo User",
    email: "demo@example.com",
    // In a real app, this would be hashed
    password: "password123",
  },
]

// Login function
export async function loginUser(params: LoginParams) {
  const { email, password } = params

  try {
    // Simulate a delay for API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Find user by email
    const user = DEMO_USERS.find((u) => u.email === email)

    // Check if user exists and password matches
    if (!user || user.password !== password) {
      return { success: false, message: "Invalid email or password" }
    }

    // Create user session
    const session = {
      userId: user.id,
      name: user.name,
      email: user.email,
    }

    // Encrypt session data
    const encryptedSession = await encrypt(JSON.stringify(session))

    // Set session cookie
    cookies().set("user-session", encryptedSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })

    return { success: true, user: { id: user.id, name: user.name, email: user.email } }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, message: "An unexpected error occurred" }
  }
}

// Signup function
export async function signupUser(params: SignupParams) {
  const { name, email, password } = params

  try {
    // Simulate a delay for API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    const existingUser = DEMO_USERS.find((u) => u.email === email)
    if (existingUser) {
      return { success: false, message: "Email already in use" }
    }

    // Create new user
    const newUser = {
      id: `${DEMO_USERS.length + 1}`,
      name,
      email,
      password, // In a real app, this would be hashed
    }

    // Add user to demo users (in a real app, this would be a database insert)
    DEMO_USERS.push(newUser)

    // Create user session
    const session = {
      userId: newUser.id,
      name: newUser.name,
      email: newUser.email,
    }

    // Encrypt session data
    const encryptedSession = await encrypt(JSON.stringify(session))

    // Set session cookie
    cookies().set("user-session", encryptedSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })

    return { success: true, user: { id: newUser.id, name: newUser.name, email: newUser.email } }
  } catch (error) {
    console.error("Signup error:", error)
    return { success: false, message: "An unexpected error occurred" }
  }
}

// Logout function
export async function logoutUser() {
  try {
    // Delete session cookie
    cookies().delete("user-session")
    return { success: true }
  } catch (error) {
    console.error("Logout error:", error)
    return { success: false, message: "An unexpected error occurred" }
  }
}

// Get current user function
export async function getCurrentUser(): Promise<User | null> {
  try {
    // Get session cookie
    const sessionCookie = cookies().get("user-session")
    if (!sessionCookie?.value) {
      return null
    }

    // Decrypt session data
    const sessionData = await decrypt(sessionCookie.value)
    const session = JSON.parse(sessionData)

    return {
      id: session.userId,
      name: session.name,
      email: session.email,
    }
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}
