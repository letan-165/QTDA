"use client"
import { withAuth } from "@/components/withAuth"
import { ScholarshipPage } from "@/components/student/scholarship-page"

export default function Page() {
  return (
    <div >
      <div className="w-full max-w-sm">
        <ScholarshipPage />
      </div>
    </div>
  )
}
