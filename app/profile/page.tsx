import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/auth/actions"
import DashboardHeader from "@/components/dashboard-header"
import ProfileContent from "@/components/profile-content"

export default async function ProfilePage() {
  const user = await getCurrentUser()

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader user={user} />

      <main className="container mx-auto py-8 px-4">
        <ProfileContent user={user} />
      </main>
    </div>
  )
}
