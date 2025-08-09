"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

export function withAuth(WrappedComponent: React.ComponentType) {
  return function ProtectedComponent(props: any) {
    const router = useRouter()

    useEffect(() => {
      const token = Cookies.get("access_token")
      if (!token) {
        router.push("/auth/login")
      }
    }, [])

    return <WrappedComponent {...props} />
  }
}

