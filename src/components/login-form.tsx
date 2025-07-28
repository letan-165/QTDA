"use client"
import { cn } from "@/lib/utils"
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
import { useRef } from "react"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Đăng nhập</CardTitle>
          <CardDescription>
            Nhập tài khoản và mật khẩu để đăng nhập
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Tài khoản</Label>
                <Input
                  id="text"
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
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="w-full">
                  Đăng nhập
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