"use client"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRef, useState, useEffect } from "react"
import { jwtDecode } from 'jwt-decode'; 

type DecodedToken = {
  sub: string
  id: string
  scope: "STUDENT" | "ADMIN" | "MENTOR" | "STUDENT_AFFAIRS"
  exp: number
}

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const formRef = useRef<HTMLFormElement>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [progressValue, setProgressValue] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form = formRef.current
    if (!form) return

    const formData = new FormData(form)
    const username = formData.get("username")
    const password = formData.get("password")

    try {
      const res = await fetch("http://localhost:8080/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || "Đăng nhập thất bại")
      }

      const data = await res.json()
      console.log("Đăng nhập thành công", data)

      localStorage.setItem("token", data.token)

      const decoded: DecodedToken = jwtDecode(data.token)
      const role = decoded.scope

      // Redirect theo role
      switch (role) {
        case "ADMIN":
          window.location.href = "/dashboard/admin"
          break
        case "STUDENT":
          window.location.href = "/dashboard/student"
          break
        case "MENTOR":
          window.location.href = "/dashboard/mentor"
          break
        case "STUDENT_AFFAIRS":
          window.location.href = "/dashboard/student-affairs"
          break
        default:
          window.location.href = "/dashboard"
      }
    } catch (err: any) {
      setError(err.message || "Lỗi không xác định")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setProgressValue((prev) => {
          const next = prev + 10
          if (next >= 90) {
            clearInterval(interval)
            return 90
          }
          return next
        })
      }, 300)

      return () => clearInterval(interval)
    } else {
      setProgressValue(100)
      const timer = setTimeout(() => setProgressValue(0), 500)
      return () => clearTimeout(timer)
    }
  }, [loading])

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        {loading && <Progress value={progressValue} className="mb-4" />}
        <CardHeader>
          <CardTitle className="text-2xl">Đăng nhập</CardTitle>
          <CardDescription>
            Nhập tài khoản và mật khẩu để đăng nhập
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Tài khoản</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="student1"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              <div className="flex gap-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>
              </div>
            </div>
          </form>

          <div className="text-center mt-4">
            <Link
              href="/auth/reset-password"
              className="text-sm underline-offset-4 hover:underline"
            >
              Đặt lại mật khẩu
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
