"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, LogOut, UserIcon } from "lucide-react"
import { logoutUser } from "@/app/auth/actions"

interface ProfileContentProps {
  user: {
    id: string
    name: string
    email: string
  }
}

export default function ProfileContent({ user }: ProfileContentProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    setError(null)

    try {
      const result = await logoutUser()
      if (result.success) {
        router.push("/auth/login")
      } else {
        setError(result.message || "Failed to log out")
        setIsLoggingOut(false)
      }
    } catch (error) {
      setError("An unexpected error occurred")
      setIsLoggingOut(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-emerald-500 text-white text-xl">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription className="text-base">{user.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Account Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="font-medium">User ID</div>
                <div>{user.id}</div>
                <div className="font-medium">Name</div>
                <div>{user.name}</div>
                <div className="font-medium">Email</div>
                <div>{user.email}</div>
                <div className="font-medium">Account Type</div>
                <div>Free</div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-2">Account Actions</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Edit Profile</div>
                    <div className="text-sm text-muted-foreground">Update your personal information</div>
                  </div>
                  <Button variant="outline" size="sm">
                    <UserIcon className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-red-600 dark:text-red-400">Log Out</div>
                    <div className="text-sm text-muted-foreground">Sign out of your account</div>
                  </div>
                  <Button variant="destructive" onClick={handleLogout} disabled={isLoggingOut}>
                    {isLoggingOut ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging out...
                      </>
                    ) : (
                      <>
                        <LogOut className="mr-2 h-4 w-4" />
                        Log Out
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-6">
          <p className="text-sm text-muted-foreground">
            Upwork AI Proposal Generator &copy; {new Date().getFullYear()}
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
