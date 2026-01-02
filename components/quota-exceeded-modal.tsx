"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CreditCard, ExternalLink } from "lucide-react"

interface QuotaExceededModalProps {
  isOpen: boolean
  onClose: () => void
}

export function QuotaExceededModal({ isOpen, onClose }: QuotaExceededModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>OpenAI API Quota Exceeded</DialogTitle>
          <DialogDescription>
            You've exceeded your OpenAI API quota. You need to update your billing information to continue generating
            proposals.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-md border border-amber-200 dark:border-amber-800">
              <h3 className="font-medium text-amber-800 dark:text-amber-300 mb-2">Why am I seeing this?</h3>
              <p className="text-sm text-amber-700 dark:text-amber-400">
                OpenAI provides a limited amount of free credits when you first sign up. Once these are used up, you
                need to add a payment method to continue using the API.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">How to fix this:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Go to the OpenAI API billing page</li>
                <li>Add a payment method to your account</li>
                <li>Set a usage limit if desired</li>
                <li>Return to this app and try generating a proposal again</li>
              </ol>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>
                Note: OpenAI charges based on token usage. For proposal generation, costs are typically very low (a few
                cents per proposal).
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="sm:w-auto w-full">
            Close
          </Button>
          <Button
            className="sm:w-auto w-full"
            onClick={() => {
              window.open("https://platform.openai.com/account/billing", "_blank")
              onClose()
            }}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Update Billing
            <ExternalLink className="ml-2 h-3 w-3" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
