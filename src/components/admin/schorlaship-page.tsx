"use client"
import { toast } from "sonner"
import { BadgeDollarSign } from "lucide-react"
import { useEffect, useState } from "react"
import { ScholarshipRegistration, fetchScholarshipRegistrations } from "@/lib/api"
import { EyeIcon } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SlashIcon, TrashIcon as DeleteIcon, ChevronsUpDownIcon, EyeIcon as ViewIcon, TrashIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
export  function ScholarshipPage() {
    const [loading, setLoading] = useState(true)
    const [registrations, setRegistrations] = useState<ScholarshipRegistration[]>([])
    const [error, setError] = useState("")

    useEffect(() => {
        loadScholarship()
    }, [])

    const loadScholarship = async () => {
      try {
        setLoading(true)
        const data = await fetchScholarshipRegistrations()
        setRegistrations(data)
      } catch (err: any) {
        setError(err.message)
        toast.error("Lỗi khi tải danh sách.")
      } finally {
        setLoading(false)
      }
    }

  return (
    <div className="p-6 w-full min-w-[80vw] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Duyệt đơn học bổng</h1>
      </div>

            <Breadcrumb className="border-b border-gray-200 pb-2 mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/admin">Admin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <SlashIcon />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/admin/scholarship">Scholarship</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
            {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border shadow">
          <p className="text-sm text-gray-500">Tổng đơn</p>
          <p className="text-2xl font-semibold">{registrations.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border shadow">
          <p className="text-sm text-gray-500">Chờ duyệt</p>
          <p className="text-2xl font-semibold text-yellow-500">
            {registrations.filter(r => r.status === "PENDING").length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border shadow">
          <p className="text-sm text-gray-500">Đã duyệt</p>
          <p className="text-2xl font-semibold text-green-500">
            {registrations.filter(r => r.status === "APPROVED").length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border shadow">
          <p className="text-sm text-gray-500">Từ chối</p>
          <p className="text-2xl font-semibold text-red-500">
            {registrations.filter(r => r.status === "REJECTED").length}
          </p>
        </div>
      </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <input type="text" placeholder="Tìm kiếm theo tên học bổng" className="border px-3 py-2 rounded w-full sm:w-72"  />
          <DropdownMenu>
            <DropdownMenuTrigger className="border px-3 py-2 rounded w-full sm:w-auto text-left flex items-center justify-between gap-2">
              <ChevronsUpDownIcon className="w-4 h-4 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Phân loại trạng thái</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem >All</DropdownMenuItem>
              <DropdownMenuItem >Chờ duyệt</DropdownMenuItem>
              <DropdownMenuItem >Đã duyệt</DropdownMenuItem>
              <DropdownMenuItem >Từ chối</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border shadow overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Sinh viên</th>
              <th className="p-4 font-semibold text-gray-600">Học bổng</th>
              <th className="p-4 font-semibold text-gray-600">Ngày nộp</th>
              <th className="p-4 font-semibold text-gray-600">Trạng thái</th>
              <th className="p-4 font-semibold text-gray-600 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((registration) => (
              <tr key={registration.registrationID} className="border-t">
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="font-medium">{registration.student.fullName}</span>
                    <span className="text-gray-500 text-xs">{registration.student.studentID}</span>
                    <span className="text-gray-500 text-xs">{registration.student.className}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="font-medium">Học bổng {registration.scholarship.scholarshipID}</span>
                    <span className="text-gray-500 text-xs">
                      {registration.scholarship.amount.toLocaleString()} VNĐ
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  {new Date(registration.createAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="p-4">
                  {registration.status === "PENDING" && (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Chờ duyệt</span>
                  )}
                  {registration.status === "APPROVED" && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Đã duyệt</span>
                  )}
                  {registration.status === "REJECTED" && (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Từ chối</span>
                  )}
                </td>
                <td className="p-4 text-center">
                  <button className="text-blue-500 hover:underline">
                    <EyeIcon className="w-4 h-4 inline-block" />
                  </button>
                </td>
              </tr>
            ))}
            {registrations.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
