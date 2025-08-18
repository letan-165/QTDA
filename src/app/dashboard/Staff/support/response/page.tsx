"use client"
import { withAuth } from "@/components/auth/withAuth"
import { ResponsePage } from "@/components/staff/response"

export default function Page() {
  return (
    <div >
      <div className="w-full max-w-sm">
        <ResponsePage />
      </div>
    </div>
  )
}
