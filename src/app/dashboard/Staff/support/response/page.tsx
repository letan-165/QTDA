"use client"
import { withAuth } from "@/components/withAuth"
import { SupportTypePage } from "@/components/staff/SupportType-page"

export default function Page() {
  return (
    <div >
      <div className="w-full max-w-sm">
        <SupportTypePage />
      </div>
    </div>
  )
}
