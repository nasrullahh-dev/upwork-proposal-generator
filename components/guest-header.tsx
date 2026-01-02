"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Key } from "lucide-react"
import { ApiKeyModal } from "@/components/api-key-modal"

export default function GuestHeader() {
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false)

  return (
    <header className="border-b bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl text-emerald-600 dark:text-emerald-400">
          Upwork AI Proposal Generator
        </Link>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => setIsApiKeyModalOpen(true)}>
            <Key className="mr-2 h-4 w-4" />
            API Key
          </Button>
          <ThemeToggle />
          <div className="flex gap-2">
            <Link href="/auth/login">
              <Button variant="outline" size="sm">
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
        </div>
      </div>

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSuccess={() => {
          // Optionally refresh the page or show a success message
        }}
      />
    </header>
  )
}
