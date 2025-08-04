"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
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
import { loginApi } from "@/lib/api"
import { handleLogin } from "@/lib/auth"

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
    const username = formData.get("username")?.toString().trim() || ""
    const password = formData.get("password")?.toString().trim() || ""

    try {
      const token = await loginApi(username, password)
      handleLogin(token)
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
            Nhập tài khoản và mật khẩu để đăng nhập hệ thống
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
                    className="ml-auto text-sm underline hover:underline-offset-4"
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

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </div>
          </form>

          <div className="text-center mt-4">
            <Link
              href="/auth/reset-password"
              className="text-sm underline hover:underline-offset-4"
            >
              Đặt lại mật khẩu
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
