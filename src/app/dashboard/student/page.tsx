"use client"
import { withAuth } from "@/components/auth/withAuth"
import { DashboardStudent} from "@/components/student/account-page"
export  function Page() {
  return (
    <div >
      <div className="w-full max-w-sm">
        <DashboardStudent />
      </div>
    </div>
  )
}
export default withAuth(Page)
