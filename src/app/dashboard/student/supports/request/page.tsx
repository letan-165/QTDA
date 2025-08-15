"use client"
import { withAuth } from "@/components/withAuth"
import { RequestPage } from "@/components/student/support-page"

export default function Page() {
  return (
    <div >
      <div className="w-full max-w-sm">
        <RequestPage />
      </div>
    </div>
  )
}
