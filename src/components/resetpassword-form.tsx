"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Cookies from "js-cookie"
import { updatePassword, changePassword } from "@/lib/api/userApi"
import { toast } from "sonner"
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

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Kiểm tra mật khẩu tương tự ProfilePage
    if (newPassword.trim() && newPassword.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự.")
      return
    }
    // Thêm kiểm tra nghiêm ngặt hơn để khắc phục PASSWORD_INVALID
    const userID = Cookies.get("userId")
      if (!userID) throw new Error("Không tìm thấy user ID")
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp.")
      return
    }
    if (!userID) {
      toast.error("Không tìm thấy thông tin người dùng.")
      return
    }

    try {
      setLoading(true)
      const updateData = [{
        userID: userID,
        password: newPassword,
        confirmPassword: confirmPassword,
      }]

      await updatePassword(updateData)
      console.log("updateData", updateData)
      toast.success("Đặt lại mật khẩu thành công!")
      router.push("/auth/login")
    } catch (err: any) {
      if (err.message.includes("PASSWORD_INVALID")) {
        toast.error("Mật khẩu không hợp lệ. Vui lòng đảm bảo mật khẩu có ít nhất 8 ký tự, bao gồm 1 chữ hoa, 1 số và 1 ký tự đặc biệt.")
      } else {
        toast.error(err.message || "Đặt lại mật khẩu thất bại.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Đặt lại mật khẩu</CardTitle>
          <CardDescription>
            Đặt lại mật khẩu mới cho tài khoản của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="new-password">Mật khẩu mới</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-black text-white hover:bg-gray-800"
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
              </Button>
              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="text-sm underline-offset-4 hover:underline"
                >
                  Trở về đăng nhập
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}