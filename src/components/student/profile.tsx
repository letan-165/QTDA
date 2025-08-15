"use client"

import { useEffect, useState } from "react"
import Cookies from 'js-cookie'
import { fetchUserDetail, UserDetail, updateStudent } from "@/lib/api/userApi"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SlashIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [user, setUser] = useState<UserDetail | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [updatedUser, setUpdatedUser] = useState({
    userID: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "",
    fullName: "",
    email: "",
    phone: "",
    student: {
      dateOfBirth: "",
      gender: "",
      className: "",
    },
  })

  // Tải thông tin người dùng
  const loadUser = async () => {
    try {
      setLoading(true)
      const userID = Cookies.get("userId")
      if (!userID) throw new Error("Không tìm thấy user ID")

      const detail = await fetchUserDetail(userID)
      setUser(detail)
      setUpdatedUser({
        userID: userID,
        username: detail.username,
        password: "",
        confirmPassword: "",
        role: detail.role,
        fullName: detail.student?.fullName || detail.staff?.fullName || "",
        email: detail.student?.email || detail.staff?.email || "",
        phone: detail.student?.phone || detail.staff?.phone || "",
        student: {
          dateOfBirth: detail.student?.dateOfBirth || "",
          gender: detail.student?.gender || "",
          className: detail.student?.className || "",
        },
      })
    } catch (err: any) {
      setError(err.message || "Không thể tải thông tin người dùng")
      toast.error("Không thể tải thông tin người dùng")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUser()
  }, [])

  const handleUpdateUser = async () => {
    if (updatedUser.password.trim() && updatedUser.password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự.")
      return
    }
    if (updatedUser.password !== updatedUser.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp.")
      return
    }

    try {
      const updateData = [{
        userID: updatedUser.userID,
        username: updatedUser.username,
        role: updatedUser.role,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        password: updatedUser.password || "",
        confirmPassword: updatedUser.confirmPassword || "",
        ...(updatedUser.role === "STUDENT" && {
          student: {
            dateOfBirth: updatedUser.student.dateOfBirth,
            gender: updatedUser.student.gender,
            className: updatedUser.student.className,
          },
        }),
      }]

      await updateStudent(updateData)
      toast.success("Cập nhật thông tin thành công!")
      setIsEditing(false)
      setUpdatedUser((prev) => ({ ...prev, password: "", confirmPassword: "" }))
      await loadUser()
    } catch (err: any) {
      toast.error(err.message || "Cập nhật thông tin thất bại.")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name in updatedUser.student) {
      setUpdatedUser((prev) => ({
        ...prev,
        student: { ...prev.student, [name]: value },
      }))
    } else {
      setUpdatedUser((prev) => ({ ...prev, [name]: value }))
    }
  }

  return (
    <div className="p-6 w-full min-w-[80vw] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Thông tin cá nhân</h1>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>Chỉnh sửa</Button>
        )}
      </div>

      {/* Breadcrumb */}
      <Breadcrumb className="border-b border-gray-200 pb-2 mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/student">Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <SlashIcon />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/student/profile">
              Thông tin cá nhân
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Nội dung */}
      {loading ? (
        <div className="flex flex-col gap-4">
          {[...Array(8)].map((_, idx) => (
            <div key={idx} className="border rounded-lg p-4 shadow animate-pulse space-y-2">
              <Skeleton className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : user ? (
        isEditing ? (
          <form onSubmit={(e) => { e.preventDefault(); handleUpdateUser(); }} className="space-y-4 max-w-lg">
            <div>
              <Label htmlFor="fullName">Họ tên</Label>
              <Input
                id="fullName"
                name="fullName"
                value={updatedUser.fullName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={updatedUser.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">SĐT</Label>
              <Input
                id="phone"
                name="phone"
                value={updatedUser.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={updatedUser.password}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={updatedUser.confirmPassword}
                onChange={handleInputChange}
              />
            </div>
            {user.role === "STUDENT" && (
              <>
                <div>
                  <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={updatedUser.student.dateOfBirth}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Giới tính</Label>
                  <Input
                    id="gender"
                    name="gender"
                    value={updatedUser.student.gender}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="className">Lớp</Label>
                  <Input
                    id="className"
                    name="className"
                    value={updatedUser.student.className}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </>
            )}
            <div className="flex gap-2">
              <Button type="submit">Lưu</Button>
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Hủy
              </Button>
            </div>
          </form>
        ) : (
          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
            <tbody>
              <tr>
                <td className="border px-4 py-2 font-semibold">Username</td>
                <td className="border px-4 py-2">{user.username}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Vai trò</td>
                <td className="border px-4 py-2">{user.role}</td>
              </tr>
              {user.role === "STAFF" && user.staff && (
                <>
                  <tr>
                    <td className="border px-4 py-2 font-semibold">Họ tên</td>
                    <td className="border px-4 py-2">{user.staff.fullName}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-semibold">Chức vụ</td>
                    <td className="border px-4 py-2">{user.staff.position}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-semibold">SĐT</td>
                    <td className="border px-4 py-2">{user.staff.phone}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-semibold">Email</td>
                    <td className="border px-4 py-2">{user.staff.email}</td>
                  </tr>
                </>
              )}
              {user.role === "STUDENT" && user.student && (
                <>
                  <tr>
                    <td className="border px-4 py-2 font-semibold">Họ tên</td>
                    <td className="border px-4 py-2">{user.student.fullName}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-semibold">Ngày sinh</td>
                    <td className="border px-4 py-2">{user.student.dateOfBirth}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-semibold">Giới tính</td>
                    <td className="border px-4 py-2">{user.student.gender}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-semibold">Lớp</td>
                    <td className="border px-4 py-2">{user.student.className}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-semibold">SĐT</td>
                    <td className="border px-4 py-2">{user.student.phone}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-semibold">Email</td>
                    <td className="border px-4 py-2">{user.student.email}</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        )
      ) : (
        <p>Không có dữ liệu</p>
      )}
    </div>
  )
}