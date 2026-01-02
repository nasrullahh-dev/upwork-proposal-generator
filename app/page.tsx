import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/auth/actions"

export default async function Home() {
  const user = await getCurrentUser()

  // Redirect to dashboard if authenticated, otherwise to guest page
  if (user) {
    redirect("/dashboard")
  } else {
    redirect("/auth/login")
  }
}
