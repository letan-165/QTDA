"use client"
import { withAuth } from "@/components/withAuth"
import { ProfilePage } from "@/components/staff/profile"

export default function Page() {
  return (
    <div >
      <div className="w-full max-w-sm">
        <ProfilePage />
      </div>
    </div>
  )
}
