import type { ProposalParams } from "@/lib/demo-generator"

export function generateCoverLetter(params: ProposalParams): string {
  const { jobTitle, jobDescription, skills, experience } = params

  // Extract key information
  const jobType = jobTitle.toLowerCase()
  const skillsList = skills
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s)
  const topSkills = skillsList.slice(0, 3).join(", ")

  // Generate cover letter
  return `Dear Hiring Manager,

I am writing to express my interest in the ${jobTitle} position at your company. With my background in ${topSkills}, I believe I am well-qualified for this role.

${experience}

Based on your job description, I understand you're looking for someone who can ${jobDescription.length > 100 ? jobDescription.substring(0, 100) + "..." : jobDescription}. I am confident that my skills and experience make me a strong candidate for this position.

I am excited about the opportunity to contribute to your team and would welcome the chance to discuss how my background, skills, and experience would be beneficial to your organization.

Thank you for considering my application. I look forward to the possibility of working with you.

Sincerely,
[Your Name]
`
}
