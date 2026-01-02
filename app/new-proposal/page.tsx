import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/auth/actions"
import NewProposalForm from "@/components/new-proposal-form"
import DashboardHeader from "@/components/dashboard-header"

export default async function NewProposalPage() {
  const user = await getCurrentUser()

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader user={user} />
      <NewProposalForm />
    </div>
  )
}
