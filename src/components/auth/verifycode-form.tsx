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

export function ResetPasswordWithCodeForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Đặt lại mật khẩu</CardTitle>
          <CardDescription>
            Nhập mã xác nhận từ email và mật khẩu mới
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="verification-code">Mã xác nhận</Label>
                <Input
                  id="verification-code"
                  type="text"
                  placeholder="Nhập mã xác nhận"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-password">Mật khẩu mới</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Xác nhận đổi mật khẩu
              </Button>
              <div className="text-center">
                <Link
                  href="#"
                  className="text-sm underline-offset-4 hover:underline"
                  onClick={(e) => {
                    e.preventDefault()
                    // Add resend logic here (e.g., API call)
                    console.log("Resend code requested")
                  }}
                >
                  Gửi lại mã
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}