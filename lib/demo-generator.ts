export type ProposalParams = {
  jobTitle: string
  jobDescription: string
  skills: string
  experience: string
}

// This function generates a proposal without using any API
export function generateDemoProposal(params: ProposalParams): string {
  const { jobTitle, jobDescription, skills, experience } = params

  // Extract key information
  const jobType = jobTitle.toLowerCase()
  const skillsList = skills
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s)
  const topSkills = skillsList.slice(0, 3).join(", ")

  // Extract a few keywords from the job description
  const keywords = extractKeywords(jobDescription, 5)

  return `
Dear Client,

I noticed your job posting for a ${jobTitle} position, and I'm excited to offer my services. With ${skillsList.length} years of experience in ${topSkills}, I believe I can deliver excellent results for your ${keywords.join(", ")} project.

${experience.length > 100 ? experience.substring(0, 100) + "..." : experience}

My approach would be to first understand your specific requirements in detail, then create a plan that aligns with your goals. I pride myself on clear communication, meeting deadlines, and delivering high-quality work.

I'd love to discuss your project in more detail. Please feel free to reach out if you have any questions.

Best regards,
[Your Name]

---
Note: This is a demo proposal generated in offline mode. For customized AI-generated proposals, please update your OpenAI API key and billing information.
`
}

// Helper function to extract keywords from text
function extractKeywords(text: string, count: number): string[] {
  // Remove common words and punctuation
  const commonWords = [
    "and",
    "the",
    "to",
    "of",
    "for",
    "in",
    "on",
    "with",
    "a",
    "an",
    "is",
    "are",
    "that",
    "this",
    "be",
    "as",
  ]
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !commonWords.includes(word))

  // Count word frequency
  const wordCount: Record<string, number> = {}
  words.forEach((word) => {
    wordCount[word] = (wordCount[word] || 0) + 1
  })

  // Sort by frequency and return top words
  return Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([word]) => word)
}
