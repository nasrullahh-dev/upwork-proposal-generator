"use client"

import type { Proposal } from "@/app/dashboard/actions"

// Key for localStorage
const PROPOSALS_STORAGE_KEY = "upwork-proposals"

// Demo proposals to initialize the storage
const DEMO_PROPOSALS: Proposal[] = [
  {
    id: "1",
    userId: "1",
    jobTitle: "React Developer",
    jobDescription: "We are looking for an experienced React developer to join our team.",
    skills: "React, TypeScript, Next.js",
    experience: "5 years of experience in frontend development",
    proposal:
      "Dear Client,\n\nI noticed your job posting for a React Developer position, and I'm excited to offer my services. With my background in React, TypeScript, and Next.js, I believe I can deliver excellent results for your project.\n\n5 years of experience in frontend development\n\nI'd love to discuss your project in more detail. Please feel free to reach out if you have any questions.\n\nBest regards,\n[Your Name]",
    coverLetter:
      "Dear Hiring Manager,\n\nI am writing to express my interest in the React Developer position at your company. With 5 years of experience in frontend development, I have a strong foundation in React, TypeScript, and Next.js.\n\nIn my previous role, I developed and maintained complex web applications using React and TypeScript. I am passionate about creating clean, efficient, and user-friendly interfaces.\n\nI look forward to the opportunity to discuss how my skills and experience align with your needs.\n\nSincerely,\n[Your Name]",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    isFavorite: true,
  },
  {
    id: "2",
    userId: "1",
    jobTitle: "Content Writer",
    jobDescription: "We need a content writer for our blog about technology and AI.",
    skills: "Content Writing, SEO, Technology",
    experience: "3 years of experience writing tech articles",
    proposal:
      "Dear Client,\n\nI noticed your job posting for a Content Writer position, and I'm excited to offer my services. With my background in Content Writing, SEO, and Technology, I believe I can deliver excellent results for your project.\n\n3 years of experience writing tech articles\n\nI'd love to discuss your project in more detail. Please feel free to reach out if you have any questions.\n\nBest regards,\n[Your Name]",
    coverLetter:
      "Dear Hiring Manager,\n\nI am writing to express my interest in the Content Writer position for your technology and AI blog. With 3 years of experience writing tech articles, I have developed a strong understanding of complex technical concepts and how to communicate them clearly to various audiences.\n\nMy background in SEO ensures that the content I create is not only engaging but also optimized for search engines. I stay up-to-date with the latest trends in technology and AI, which allows me to create relevant and timely content.\n\nI look forward to the opportunity to contribute to your blog.\n\nSincerely,\n[Your Name]",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    isFavorite: false,
  },
]

// Get all proposals from localStorage
export function getStoredProposals(): Proposal[] {
  if (typeof window === "undefined") return []

  try {
    const storedData = localStorage.getItem(PROPOSALS_STORAGE_KEY)

    // If there's no data in localStorage, initialize with demo proposals
    if (!storedData) {
      saveProposalsToStorage(DEMO_PROPOSALS)
      return DEMO_PROPOSALS
    }

    return JSON.parse(storedData)
  } catch (error) {
    console.error("Error getting proposals from localStorage:", error)
    return []
  }
}

// Save all proposals to localStorage
export function saveProposalsToStorage(proposals: Proposal[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(PROPOSALS_STORAGE_KEY, JSON.stringify(proposals))
  } catch (error) {
    console.error("Error saving proposals to localStorage:", error)
  }
}

// Add a new proposal
export function addProposalToStorage(proposal: Proposal): void {
  const proposals = getStoredProposals()
  proposals.unshift(proposal) // Add to beginning
  saveProposalsToStorage(proposals)
}

// Update a proposal
export function updateProposalInStorage(id: string, updates: Partial<Proposal>): boolean {
  const proposals = getStoredProposals()
  const index = proposals.findIndex((p) => p.id === id)

  if (index === -1) return false

  proposals[index] = { ...proposals[index], ...updates }
  saveProposalsToStorage(proposals)
  return true
}

// Delete a proposal
export function deleteProposalFromStorage(id: string): boolean {
  const proposals = getStoredProposals()
  const index = proposals.findIndex((p) => p.id === id)

  if (index === -1) return false

  proposals.splice(index, 1)
  saveProposalsToStorage(proposals)
  return true
}

// Toggle favorite status
export function toggleProposalFavoriteInStorage(id: string): boolean {
  const proposals = getStoredProposals()
  const index = proposals.findIndex((p) => p.id === id)

  if (index === -1) return false

  proposals[index].isFavorite = !proposals[index].isFavorite
  saveProposalsToStorage(proposals)
  return true
}
