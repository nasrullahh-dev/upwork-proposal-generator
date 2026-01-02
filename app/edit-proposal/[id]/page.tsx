"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Copy, CheckCircle2, AlertCircle, ArrowLeft, Save, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { getStoredProposals, updateProposalInStorage } from "@/lib/client-storage"
import { generateCoverLetter } from "@/lib/cover-letter-generator"

export default function EditProposalPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [jobDescription, setJobDescription] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [skills, setSkills] = useState("")
  const [experience, setExperience] = useState("")
  const [proposal, setProposal] = useState("")
  const [coverLetter, setCoverLetter] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [copied, setCopied] = useState<"proposal" | "cover" | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    // Load proposal from localStorage
    const proposals = getStoredProposals()
    const proposalToEdit = proposals.find((p) => p.id === id)

    if (proposalToEdit) {
      setJobTitle(proposalToEdit.jobTitle)
      setJobDescription(proposalToEdit.jobDescription)
      setSkills(proposalToEdit.skills)
      setExperience(proposalToEdit.experience)
      setProposal(proposalToEdit.proposal)
      setCoverLetter(proposalToEdit.coverLetter)
    } else {
      setError("Proposal not found")
    }

    setIsLoading(false)
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)
    setSuccess(null)

    try {
      // Update proposal in localStorage
      const updated = updateProposalInStorage(id, {
        jobTitle,
        jobDescription,
        skills,
        experience,
        proposal,
        coverLetter,
      })

      if (updated) {
        setSuccess("Proposal updated successfully!")

        // Notify other components
        window.dispatchEvent(new Event("proposalsUpdated"))

        setTimeout(() => {
          setSuccess(null)
        }, 3000)
      } else {
        setError("Failed to update proposal")
      }
    } catch (error) {
      setError("An unexpected error occurred while saving")
    } finally {
      setIsSaving(false)
    }
  }

  const handleRegenerateCoverLetter = () => {
    setIsRegenerating(true)
    setError(null)

    try {
      // Generate new cover letter
      const newCoverLetter = generateCoverLetter({
        jobTitle,
        jobDescription,
        skills,
        experience,
      })

      setCoverLetter(newCoverLetter)
    } catch (error) {
      setError("An unexpected error occurred while regenerating cover letter")
    } finally {
      setIsRegenerating(false)
    }
  }

  const copyToClipboard = (text: string, type: "proposal" | "cover") => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <p>Loading proposal...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="border-b bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="font-bold text-xl">Edit Proposal</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert variant="success" className="mb-6">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="details" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Job Details</TabsTrigger>
              <TabsTrigger value="proposal">Proposal</TabsTrigger>
              <TabsTrigger value="cover">Cover Letter</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Job Details</CardTitle>
                  <CardDescription>Edit the job details for your proposal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input
                      id="jobTitle"
                      placeholder="e.g., React Developer, Content Writer"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jobDescription">Job Description</Label>
                    <Textarea
                      id="jobDescription"
                      placeholder="Paste the job description here..."
                      className="min-h-[150px]"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">Your Relevant Skills</Label>
                    <Textarea
                      id="skills"
                      placeholder="List your relevant skills and technologies..."
                      className="min-h-[100px]"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Your Relevant Experience</Label>
                    <Textarea
                      id="experience"
                      placeholder="Briefly describe your relevant experience..."
                      className="min-h-[100px]"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="proposal">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Proposal</CardTitle>
                  <CardDescription>Make changes to your proposal text</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    className="min-h-[400px] font-mono text-sm"
                    value={proposal}
                    onChange={(e) => setProposal(e.target.value)}
                    placeholder="Your proposal text..."
                    required
                  />
                </CardContent>
                <CardFooter className="justify-between">
                  <Button type="button" variant="outline" onClick={() => copyToClipboard(proposal, "proposal")}>
                    {copied === "proposal" ? (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="cover">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Edit Cover Letter</CardTitle>
                    <CardDescription>Make changes to your cover letter text</CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRegenerateCoverLetter}
                    disabled={isRegenerating}
                  >
                    {isRegenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Regenerating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Regenerate
                      </>
                    )}
                  </Button>
                </CardHeader>
                <CardContent>
                  <Textarea
                    className="min-h-[400px] font-mono text-sm"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Your cover letter text..."
                    required
                  />
                </CardContent>
                <CardFooter className="justify-between">
                  <Button type="button" variant="outline" onClick={() => copyToClipboard(coverLetter, "cover")}>
                    {copied === "cover" ? (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="max-w-4xl mx-auto mt-6 flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
              Back to Dashboard
            </Button>
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </main>
  )
}
