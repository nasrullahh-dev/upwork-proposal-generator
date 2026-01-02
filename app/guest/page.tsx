"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Copy, CheckCircle2, AlertCircle, WifiOff, Wifi, Save } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { generateProposal } from "@/app/actions"
import { generateDemoProposal } from "@/lib/demo-generator"
import GuestHeader from "@/components/guest-header"
import Link from "next/link"
import { QuotaExceededModal } from "@/components/quota-exceeded-modal"

export default function GuestProposalPage() {
  const [jobDescription, setJobDescription] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [skills, setSkills] = useState("")
  const [experience, setExperience] = useState("")
  const [proposal, setProposal] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [offlineMode, setOfflineMode] = useState(true)
  const [showQuotaExceededModal, setShowQuotaExceededModal] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    setProposal("")
    setError(null)

    const formData = {
      jobTitle,
      jobDescription,
      skills,
      experience,
    }

    try {
      let generatedProposal = ""

      if (offlineMode) {
        // Use the offline demo generator
        generatedProposal = generateDemoProposal(formData)
      } else {
        // Use the OpenAI API
        generatedProposal = await generateProposal(formData)

        // Check for API key specific responses
        if (generatedProposal === "API_KEY_MISSING") {
          setError("OpenAI API key is missing. Please use offline mode.")
          setIsGenerating(false)
          return
        } else if (generatedProposal === "API_KEY_INVALID") {
          setError("Invalid OpenAI API key. Please use offline mode.")
          setIsGenerating(false)
          return
        } else if (generatedProposal === "API_KEY_RATE_LIMIT") {
          setError("OpenAI API rate limit exceeded. Please try again later or use offline mode.")
          setIsGenerating(false)
          return
        } else if (generatedProposal === "API_KEY_QUOTA_EXCEEDED") {
          setShowQuotaExceededModal(true)
          // Fall back to offline mode
          generatedProposal = generateDemoProposal(formData)
        } else if (generatedProposal.startsWith("Error:") || generatedProposal.startsWith("Failed")) {
          setError(generatedProposal)
          // Fall back to offline mode
          generatedProposal = generateDemoProposal(formData)
        }
      }

      setProposal(generatedProposal)

      // Switch to result tab
      setTimeout(() => {
        const resultTab = document.querySelector('[data-value="result"]') as HTMLElement
        if (resultTab) resultTab.click()
      }, 500)
    } catch (error: any) {
      console.error("Error generating proposal:", error)
      setError("An unexpected error occurred. Using offline mode instead.")

      // Fall back to offline mode
      const demoProposal = generateDemoProposal({
        jobTitle,
        jobDescription,
        skills,
        experience,
      })
      setProposal(demoProposal)

      // Switch to result tab
      setTimeout(() => {
        const resultTab = document.querySelector('[data-value="result"]') as HTMLElement
        if (resultTab) resultTab.click()
      }, 500)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(proposal)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const toggleOfflineMode = () => {
    setOfflineMode(!offlineMode)
    setError(null)
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <GuestHeader />

      <div className="container mx-auto py-8 px-4">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Generate Proposal</h1>
          <div className="flex items-center space-x-2">
            <Switch id="offline-mode" checked={offlineMode} onCheckedChange={toggleOfflineMode} />
            <Label htmlFor="offline-mode" className="flex items-center cursor-pointer">
              {offlineMode ? <WifiOff className="h-4 w-4 mr-1" /> : <Wifi className="h-4 w-4 mr-1" />}
              {offlineMode ? "Offline Mode" : "Online Mode"}
            </Label>
          </div>
        </div>

        <div className="mb-6">
          <Alert variant="warning">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Guest Mode</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <span>You're using the app as a guest. Your proposals won't be saved.</span>
              <div className="flex gap-2 mt-1">
                <Link href="/auth/login">
                  <Button size="sm" variant="outline">
                    Log In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            </AlertDescription>
          </Alert>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <span>{error}</span>
              {!offlineMode && (
                <Button size="sm" variant="outline" onClick={() => setOfflineMode(true)}>
                  <WifiOff className="mr-2 h-4 w-4" />
                  Switch to Offline Mode
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="generate" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">Generate Proposal</TabsTrigger>
            <TabsTrigger value="result" disabled={!proposal}>
              Result
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate">
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
                <CardDescription>
                  {offlineMode
                    ? "Enter job details to generate a proposal (Offline Mode)"
                    : "Enter the job details to generate a customized proposal"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
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

                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : offlineMode ? (
                      "Generate Proposal (Offline)"
                    ) : (
                      "Generate Proposal"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="result">
            <Card>
              <CardHeader>
                <CardTitle>{offlineMode ? "Generated Proposal (Offline Mode)" : "Generated Proposal"}</CardTitle>
                <CardDescription>
                  {offlineMode
                    ? "This proposal was generated offline without using AI"
                    : "Your AI-generated proposal is ready to use"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md min-h-[300px] whitespace-pre-wrap">
                  {proposal}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    const generateTab = document.querySelector('[data-value="generate"]') as HTMLElement
                    if (generateTab) generateTab.click()
                  }}
                >
                  Edit Details
                </Button>
                <div className="flex gap-2">
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800"
                    onClick={copyToClipboard}
                  >
                    {copied ? (
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
                  <Link href="/auth/signup">
                    <Button variant="default">
                      <Save className="mr-2 h-4 w-4" />
                      Sign Up to Save
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <QuotaExceededModal isOpen={showQuotaExceededModal} onClose={() => setShowQuotaExceededModal(false)} />
      </div>
    </main>
  )
}
