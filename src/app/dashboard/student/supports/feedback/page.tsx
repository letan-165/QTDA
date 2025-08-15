"use client"
import { withAuth } from "@/components/withAuth"
import { SupportFeedbackPage } from "@/components/student/feedback"

export default function Page() {
  return (
    <div >
      <div className="w-full max-w-sm">
        <SupportFeedbackPage />
      </div>
    </div>
  )
}
