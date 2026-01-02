"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Copy, MoreVertical, Star, Trash, Calendar } from "lucide-react"
import type { Proposal } from "@/app/dashboard/actions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteProposalFromStorage, toggleProposalFavoriteInStorage } from "@/lib/client-storage"

interface ProposalCardProps {
  proposal: Proposal
}

export default function ProposalCard({ proposal: initialProposal }: ProposalCardProps) {
  const [proposal, setProposal] = useState(initialProposal)
  const [isFavorite, setIsFavorite] = useState(proposal.isFavorite)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [copied, setCopied] = useState<"proposal" | "cover" | null>(null)

  const handleToggleFavorite = () => {
    const newFavoriteState = !isFavorite
    setIsFavorite(newFavoriteState)
    setProposal({ ...proposal, isFavorite: newFavoriteState })

    // Update in storage
    toggleProposalFavoriteInStorage(proposal.id)

    // Dispatch event to notify other components
    window.dispatchEvent(new Event("proposalsUpdated"))
  }

  const handleDelete = () => {
    setIsDeleting(true)

    // Delete from storage
    deleteProposalFromStorage(proposal.id)

    // Dispatch event to notify other components
    window.dispatchEvent(new Event("proposalsUpdated"))

    setIsDeleting(false)
    setShowDeleteDialog(false)
  }

  const copyToClipboard = (text: string, type: "proposal" | "cover") => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-bold">{proposal.jobTitle}</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className={isFavorite ? "text-yellow-500" : "text-gray-400"}
                onClick={handleToggleFavorite}
                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Star className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-red-600">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <Calendar className="mr-1 h-3 w-3" />
            {formatDate(proposal.createdAt)}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {proposal.skills.split(",").map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill.trim()}
              </Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <Tabs defaultValue="proposal" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="proposal">Proposal</TabsTrigger>
              <TabsTrigger value="cover">Cover Letter</TabsTrigger>
            </TabsList>
            <TabsContent value="proposal" className="mt-4">
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md text-sm h-[150px] overflow-y-auto whitespace-pre-wrap">
                {proposal.proposal}
              </div>
            </TabsContent>
            <TabsContent value="cover" className="mt-4">
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md text-sm h-[150px] overflow-y-auto whitespace-pre-wrap">
                {proposal.coverLetter}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="pt-3 flex justify-between">
          <Link href={`/edit-proposal/${proposal.id}`}>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </Link>
          <Button
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800"
            onClick={() => {
              const activeTab = document.querySelector('[data-state="active"][data-value]')
              const value = activeTab?.getAttribute("data-value")
              if (value === "proposal") {
                copyToClipboard(proposal.proposal, "proposal")
              } else if (value === "cover") {
                copyToClipboard(proposal.coverLetter, "cover")
              }
            }}
          >
            <Copy className="mr-2 h-4 w-4" />
            {copied ? "Copied!" : "Copy"}
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this proposal. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
