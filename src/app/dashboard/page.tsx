// app/dashboard/page.tsx
import { getUserRole } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardRedirect() {
  const role = await getUserRole()

  switch (role) {
    case "STUDENT":
      redirect("/dashboard/student")
    case "ADMIN":
      redirect("/dashboard/admin")
    case "MENTOR":
      redirect("/dashboard/mentor")
    case "STUDENT_AFFAIRS":
      redirect("/dashboard/student-affairs")
    default:
      redirect("/auth/login")
  }
}
