"use server"

import { getCurrentUser } from "@/app/auth/actions"
import { generateCoverLetter } from "@/lib/cover-letter-generator"
import { findProposalById, updateProposalById } from "@/lib/proposal-store"
import type { Proposal } from "@/app/dashboard/actions"

// Get proposal by ID
export async function getProposalById(
  id: string,
): Promise<{ success: boolean; proposal?: Proposal; message?: string }> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, message: "Not authenticated" }
    }

    // Find proposal
    const proposal = findProposalById(id, user.id)
    if (!proposal) {
      return { success: false, message: "Proposal not found" }
    }

    return { success: true, proposal }
  } catch (error) {
    console.error("Get proposal by ID error:", error)
    return { success: false, message: "An unexpected error occurred" }
  }
}

// Update proposal
export async function updateProposal(params: {
  id: string
  jobTitle: string
  jobDescription: string
  skills: string
  experience: string
  proposal: string
  coverLetter: string
}): Promise<{ success: boolean; message?: string }> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, message: "Not authenticated" }
    }

    const { id, jobTitle, jobDescription, skills, experience, proposal, coverLetter } = params

    // Update proposal with all fields
    const success = updateProposalById(id, user.id, {
      jobTitle,
      jobDescription,
      skills,
      experience,
      proposal,
      coverLetter,
    })

    if (!success) {
      return { success: false, message: "Proposal not found" }
    }

    return { success: true }
  } catch (error) {
    console.error("Update proposal error:", error)
    return { success: false, message: "An unexpected error occurred" }
  }
}

// Regenerate cover letter
export async function regenerateCoverLetter(params: {
  jobTitle: string
  jobDescription: string
  skills: string
  experience: string
}): Promise<{ success: boolean; coverLetter?: string; message?: string }> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, message: "Not authenticated" }
    }

    // Generate new cover letter
    const coverLetter = generateCoverLetter(params)

    return { success: true, coverLetter }
  } catch (error) {
    console.error("Regenerate cover letter error:", error)
    return { success: false, message: "An unexpected error occurred" }
  }
}
