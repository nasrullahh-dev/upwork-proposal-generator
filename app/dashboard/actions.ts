"use server"

import { getCurrentUser } from "@/app/auth/actions"
import { generateCoverLetter } from "@/lib/cover-letter-generator"
import { DEMO_PROPOSALS, addProposal, toggleProposalFavorite, deleteProposalById } from "@/lib/proposal-store"

// Types
export type Proposal = {
  id: string
  userId: string
  jobTitle: string
  jobDescription: string
  skills: string
  experience: string
  proposal: string
  coverLetter: string
  createdAt: string
  isFavorite: boolean
}

// Get user's proposals
export async function getUserProposals(userId: string): Promise<Proposal[]> {
  try {
    // Filter proposals by user ID
    return DEMO_PROPOSALS.filter((p) => p.userId === userId)
  } catch (error) {
    console.error("Get user proposals error:", error)
    return []
  }
}

// Save proposal
export async function saveProposal(params: {
  jobTitle: string
  jobDescription: string
  skills: string
  experience: string
  proposal: string
}): Promise<{ success: boolean; proposal?: Proposal; message?: string }> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, message: "Not authenticated" }
    }

    const { jobTitle, jobDescription, skills, experience, proposal } = params

    // Generate cover letter
    const coverLetter = generateCoverLetter({
      jobTitle,
      jobDescription,
      skills,
      experience,
    })

    // Create new proposal with a unique ID
    const newId = `new-${Date.now()}`

    const newProposal: Proposal = {
      id: newId,
      userId: user.id,
      jobTitle,
      jobDescription,
      skills,
      experience,
      proposal,
      coverLetter,
      createdAt: new Date().toISOString(),
      isFavorite: false,
    }

    console.log("Creating new proposal:", newProposal)

    // Add proposal to demo proposals
    addProposal(newProposal)

    return { success: true, proposal: newProposal }
  } catch (error) {
    console.error("Save proposal error:", error)
    return { success: false, message: "An unexpected error occurred" }
  }
}

// Toggle favorite
export async function toggleFavorite(proposalId: string): Promise<{ success: boolean; message?: string }> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, message: "Not authenticated" }
    }

    // Toggle favorite
    const success = toggleProposalFavorite(proposalId, user.id)
    if (!success) {
      return { success: false, message: "Proposal not found" }
    }

    return { success: true }
  } catch (error) {
    console.error("Toggle favorite error:", error)
    return { success: false, message: "An unexpected error occurred" }
  }
}

// Delete proposal
export async function deleteProposal(proposalId: string): Promise<{ success: boolean; message?: string }> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, message: "Not authenticated" }
    }

    // Delete proposal
    const success = deleteProposalById(proposalId, user.id)
    if (!success) {
      return { success: false, message: "Proposal not found" }
    }

    return { success: true }
  } catch (error) {
    console.error("Delete proposal error:", error)
    return { success: false, message: "An unexpected error occurred" }
  }
}
