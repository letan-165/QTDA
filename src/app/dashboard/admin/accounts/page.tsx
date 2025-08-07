"use client"
import { withAuth } from "@/components/withAuth"
import { AccountPage } from "@/components/admin/accounts-page"
export default function Page() {
  return (
    <div >
      <div className="w-full max-w-sm">
        <AccountPage />
      </div>
    </div>
  )
}
//export default withAuth(Page)
