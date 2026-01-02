"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardHeader from "@/components/dashboard-header"
import ProposalCard from "@/components/proposal-card"
import EmptyState from "@/components/empty-state"
import { Loader2 } from "lucide-react"
import { getStoredProposals } from "@/lib/client-storage"
import type { Proposal } from "@/app/dashboard/actions"

export default function DashboardPage() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load proposals from localStorage on component mount
  useEffect(() => {
    const loadProposals = () => {
      const storedProposals = getStoredProposals()
      setProposals(storedProposals)
      setIsLoading(false)
    }

    loadProposals()

    // Also set up an event listener to refresh when storage changes
    const handleStorageChange = () => {
      loadProposals()
    }

    window.addEventListener("storage", handleStorageChange)

    // Custom event for our app to trigger refresh
    window.addEventListener("proposalsUpdated", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("proposalsUpdated", handleStorageChange)
    }
  }, [])

  // Mock user for demo
  const user = {
    id: "1",
    name: "Demo User",
    email: "demo@example.com",
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <p>Loading proposals...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader user={user} />

      <main className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Proposals</h1>
          <Link href="/new-proposal">
            <Button className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800">
              Create New Proposal
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
            <TabsTrigger value="all">All Proposals</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {proposals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {proposals.map((proposal) => (
                  <ProposalCard key={proposal.id} proposal={proposal} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No proposals yet"
                description="Create your first proposal to get started"
                action={
                  <Link href="/new-proposal">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800">
                      Create New Proposal
                    </Button>
                  </Link>
                }
              />
            )}
          </TabsContent>

          <TabsContent value="recent">
            {proposals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {proposals
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .slice(0, 6)
                  .map((proposal) => (
                    <ProposalCard key={proposal.id} proposal={proposal} />
                  ))}
              </div>
            ) : (
              <EmptyState
                title="No recent proposals"
                description="Create your first proposal to get started"
                action={
                  <Link href="/new-proposal">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800">
                      Create New Proposal
                    </Button>
                  </Link>
                }
              />
            )}
          </TabsContent>

          <TabsContent value="favorites">
            {proposals.filter((p) => p.isFavorite).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {proposals
                  .filter((p) => p.isFavorite)
                  .map((proposal) => (
                    <ProposalCard key={proposal.id} proposal={proposal} />
                  ))}
              </div>
            ) : (
              <EmptyState
                title="No favorite proposals"
                description="Mark proposals as favorites to see them here"
                action={
                  <Link href="/new-proposal">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800">
                      Create New Proposal
                    </Button>
                  </Link>
                }
              />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
