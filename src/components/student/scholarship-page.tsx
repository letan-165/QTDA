"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { EyeIcon, SlashIcon, ChevronsUpDownIcon, Settings } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"

import {
  fetchScholarshipRegistrationsByStudent,
  registerScholarship
} from "@/lib/api/studentApi"

import { ScholarshipRegistration } from "@/lib/api/scholarshipApi"
import { NotificationItem, fetchNotifications } from "@/lib/api/notificationApi"

export function ScholarshipPage() {
  const [loading, setLoading] = useState(true)
  const [registrations, setRegistrations] = useState<ScholarshipRegistration[]>([])
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")
  const [openDialog, setOpenDialog] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loadingNoti, setLoadingNoti] = useState(true)

  useEffect(() => {
    loadScholarship()
    loadNotification()
  }, [])

  const loadScholarship = async () => {
    try {
      setLoading(true)
      const data = await fetchScholarshipRegistrationsByStudent()
      setRegistrations(data)
    } catch (err: any) {
      setError(err.message)
      toast.error("Lỗi khi tải danh sách.")
    } finally {
      setLoading(false)
    }
  }

  const loadNotification = async () => {
    try {
      setLoadingNoti(true)
      const data = await fetchNotifications()
      setNotifications(data)
    } catch (err: any) {
      setError(err.message)
      toast.error("Lỗi khi tải thông báo.")
    } finally {
      setLoadingNoti(false)
    }
  }

  async function handleRegister(scholarshipID: number) {
    try {
      const result = await registerScholarship(scholarshipID)
      toast.success("Đăng ký học bổng thành công!")
      console.log(result)
    } catch (err: any) {
      toast.error(err.message || "Đăng ký thất bại")
    }
  }

  const filteredStatus = registrations.filter((registration) => {
    const matchesSearch = registration.scholarship.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "All" || registration.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const renderStats = () => (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
      <div className="bg-gray-300 rounded-xl p-4 border shadow">
        <p className="text-sm text-gray-500">Tổng đơn</p>
        <p className="text-2xl font-semibold">{registrations.length}</p>
      </div>
      <div className="bg-yellow-100 rounded-xl p-4 border shadow">
        <p className="text-sm text-yellow-500">Chờ duyệt</p>
        <p className="text-2xl font-semibold text-yellow-500">
          {registrations.filter((r) => r.status === "PENDING").length}
        </p>
      </div>
      <div className="bg-green-100 rounded-xl p-4 border shadow">
        <p className="text-sm text-green-500">Đã duyệt</p>
        <p className="text-2xl font-semibold text-green-500">
          {registrations.filter((r) => r.status === "APPROVED").length}
        </p>
      </div>
      <div className="bg-red-100 rounded-xl p-4 border shadow">
        <p className="text-sm text-red-500">Từ chối</p>
        <p className="text-2xl font-semibold text-red-500">
          {registrations.filter((r) => r.status === "REJECTED").length}
        </p>
      </div>
    </div>
  )

  const renderScholarship = () => (
    <div>
      {loadingNoti ? (
        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="border rounded-lg p-4 shadow animate-pulse space-y-2">
              <Skeleton className="h-4 bg-gray-200 rounded w-3/4" />
              <Skeleton className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">{error}</div>
      ) : notifications.filter((n) => n.type === "SCHOLARSHIP" && n.scholarship).length === 0 ? (
        <div className="text-center py-10 text-gray-500">Không có học bổng nào.</div>
      ) : (
        <ScrollArea className="h-[300px] pr-4">
          <div className="flex flex-col gap-4 mb-8">
            {notifications
              .filter((n) => n.type === "SCHOLARSHIP" && n.scholarship)
              .map((notification) => (
                <div
                  key={notification.notificationID}
                  className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
                        {notification.scholarship!.name}
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                          Học bổng
                        </span>
                      </h2>
                    </div>
                    <button
                      className="bg-gray-600 hover:bg-gray-800 text-white px-3 py-1 rounded"
                      onClick={() => {
                        if (notification.scholarship?.scholarshipID) 
                          handleRegister(notification.scholarship.scholarshipID);
                      }}
                    >
                      Đăng ký
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap text-sm text-gray-500 gap-4">
                    <div>💰 Số tiền: {notification.scholarship!.amount.toLocaleString()} VND</div>
                    <div>📅 Hạn nộp: {new Date(notification.scholarship!.deadline).toLocaleDateString("vi-VN")}</div>
                  </div>
                </div>
              ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )

  const renderTable = () => (
    <div className="bg-white rounded-xl border shadow overflow-x-auto">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 font-semibold text-gray-600">Học bổng</th>
            <th className="p-4 font-semibold text-gray-600">Số tiền</th>
            <th className="p-4 font-semibold text-gray-600">Ngày nộp</th>
            <th className="p-4 font-semibold text-gray-600">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            [...Array(5)].map((_, index) => (
              <tr key={index} className="border-t">
                <td className="p-4"><Skeleton className="h-4 w-32" /></td>
                <td className="p-4"><Skeleton className="h-4 w-28" /></td>
                <td className="p-4"><Skeleton className="h-4 w-20" /></td>
                <td className="p-4"><Skeleton className="h-6 w-24" /></td>
              </tr>
            ))
          ) : error ? (
            <tr>
              <td colSpan={4} className="p-4 text-center text-red-500">
                {error}
              </td>
            </tr>
          ) : filteredStatus.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-4 text-center text-gray-500">
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            filteredStatus.map((registration) => (
              <tr key={registration.registrationID} className="border-t">
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="font-medium">{registration.scholarship.name}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="font-medium">
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
                  {registration.status === "EXPIRED" && (
                    <span className="bg-gray-300 text-gray-800 px-2 py-1 rounded text-xs">Quá hạn</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="p-6 w-full min-w-[80vw] mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Danh sách học bổng đã đăng ký</h1>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <button className="bg-gray-600 hover:bg-gray-800 text-white px-4 py-2 rounded-lg shadow">
              Đăng ký
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Chọn học bổng để đăng ký</DialogTitle>
            </DialogHeader>
            {renderScholarship()}
          </DialogContent>
        </Dialog>
      </div>

      <Breadcrumb className="border-b border-gray-200 pb-2 mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/student">Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <SlashIcon />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/student/scholarships">Học bổng</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {renderStats()}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Input
            placeholder="Tìm kiếm theo tên học bổng..."
            className="w-full sm:w-72"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <DropdownMenu>
            <DropdownMenuTrigger className="border px-3 py-2 rounded w-full sm:w-auto text-left flex items-center justify-between gap-2">
              <span>{filterStatus}</span>
              <ChevronsUpDownIcon className="w-4 h-4 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Phân loại trạng thái</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilterStatus("All")}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("PENDING")}>Chờ duyệt</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("APPROVED")}>Đã duyệt</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("REJECTED")}>Từ chối</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {renderTable()}
    </div>
  )
}