"use client"
import { withAuth } from "@/components/withAuth"
import { StudentDashboardPage} from "@/components/student/account-page"
export  function Page() {
  return (
    <div >
      <div className="w-full max-w-sm">
        <StudentDashboardPage />
      </div>
    </div>
  )
}
export default withAuth(Page)
