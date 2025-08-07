"use client"
import { withAuth } from "@/components/withAuth"
import { NotificationPage } from "@/components/admin/notification-page"

export default function Page() {
  return (
    <div >
      <div className="w-full max-w-sm">
        <NotificationPage />
      </div>
    </div>
  )
}
