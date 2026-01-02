import type { Proposal } from "@/app/dashboard/actions"

// Shared data store for proposals
// In a real app, this would be a database
export const DEMO_PROPOSALS: Proposal[] = [
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

// Helper function to find a proposal by ID
export function findProposalById(id: string, userId: string): Proposal | undefined {
  return DEMO_PROPOSALS.find((p) => p.id === id && p.userId === userId)
}

// Helper function to find a proposal index by ID
export function findProposalIndexById(id: string, userId: string): number {
  return DEMO_PROPOSALS.findIndex((p) => p.id === id && p.userId === userId)
}

// Helper function to add a proposal
export function addProposal(proposal: Proposal): void {
  // Add the proposal to the beginning of the array so it appears at the top of the recent list
  DEMO_PROPOSALS.unshift(proposal)
  console.log("Added proposal:", proposal)
  console.log("Current proposals:", DEMO_PROPOSALS)
}

// Helper function to update a proposal
export function updateProposalById(id: string, userId: string, updates: Partial<Proposal>): boolean {
  const index = findProposalIndexById(id, userId)
  if (index === -1) return false

  console.log("Before update:", DEMO_PROPOSALS[index])

  // Make sure we're explicitly updating each field
  if (updates.jobTitle !== undefined) DEMO_PROPOSALS[index].jobTitle = updates.jobTitle
  if (updates.jobDescription !== undefined) DEMO_PROPOSALS[index].jobDescription = updates.jobDescription
  if (updates.skills !== undefined) DEMO_PROPOSALS[index].skills = updates.skills
  if (updates.experience !== undefined) DEMO_PROPOSALS[index].experience = updates.experience
  if (updates.proposal !== undefined) DEMO_PROPOSALS[index].proposal = updates.proposal
  if (updates.coverLetter !== undefined) DEMO_PROPOSALS[index].coverLetter = updates.coverLetter

  console.log("After update:", DEMO_PROPOSALS[index])
  return true
}

// Helper function to delete a proposal
export function deleteProposalById(id: string, userId: string): boolean {
  const index = findProposalIndexById(id, userId)
  if (index === -1) return false

  DEMO_PROPOSALS.splice(index, 1)
  return true
}

// Helper function to toggle favorite status
export function toggleProposalFavorite(id: string, userId: string): boolean {
  const index = findProposalIndexById(id, userId)
  if (index === -1) return false

  DEMO_PROPOSALS[index].isFavorite = !DEMO_PROPOSALS[index].isFavorite
  return true
}
