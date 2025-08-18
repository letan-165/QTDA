
"use client"

import { useEffect, useState, ChangeEvent } from "react"
import { fetchNotifications,  NotificationItem } from "@/lib/api/notificationApi"
import { toast } from "sonner"
import * as XLSX from "xlsx"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SlashIcon, ChevronsUpDownIcon,  } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Skeleton } from "@/components/ui/skeleton"


export function NotificationPage() {
  const [notices, setNotice] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("All")
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")

  
    useEffect(() => {
    loadNotification()
  }, [])

  const loadNotification = async () => {
    try {
      setLoading(true)
      const data = await fetchNotifications()
      setNotice(data)
    } catch (err: any) {
      setError(err.message)
      toast.error("Lỗi khi tải thông báo.")
    } finally {
      setLoading(false)
      }
    }

const filteredNotice = notices
  .filter((notice) => {
    const matchesSearch =
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.staffName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = filterType === "All" || notice.type === filterType

    return matchesSearch && matchesType
  })
  .sort((a, b) => {
    const dateA = new Date(a.createAt).getTime()
    const dateB = new Date(b.createAt).getTime()
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB
  })
  const renderStats = () =>(
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 items-stretch">
      <div className="bg-gray-300 rounded-xl p-4 border shadow h-full flex flex-col justify-between">
        <p className="text-sm text-gray-1000">Hệ thống</p>
        <p className="text-2xl font-semibold text-gray-1000">            
          {notices.filter(r => r.type === "DEFAULT").length}
        </p>
      </div>
      <div className="bg-purple-100 rounded-xl p-4 border shadow h-full flex flex-col justify-between">
        <p className="text-sm text-purple-800">Sự kiện</p>
        <p className="text-2xl font-semibold text-purple-500">
          {notices.filter(r => r.type === "EVENT").length}
        </p>
      </div>
      <div className="bg-blue-100 rounded-xl p-4 border shadow h-full flex flex-col justify-between">
        <p className="text-sm text-blue-800">Học bổng</p>
        <p className="text-2xl font-semibold text-blue-800">
          {notices.filter(r => r.type === "SCHOLARSHIP").length}
        </p>
      </div>
    </div>
  )

  const renderNotice = () =>(
    <div className="flex flex-col gap-4 mb-8">
            {loading ? (
      <div className="flex flex-col gap-4">
      {[...Array(3)].map((_, idx) => (
        <div key={idx} className="border rounded-lg p-4 shadow animate-pulse space-y-2">
            <Skeleton className="h-4 bg-gray-200 rounded w-3/4"></Skeleton>
            <Skeleton className="h-3 bg-gray-200 rounded w-full"></Skeleton>
            <Skeleton className="h-3 bg-gray-200 rounded w-1/2"></Skeleton>
        </div>
      ))}
    </div>

    ) : error ? (
      <div className="text-center py-10 text-red-500">{error}</div>
    ) : notices.length === 0 ? (
      <div className="text-center py-10 text-gray-500">Không có thông báo nào.</div>
    ) : (
      <div className="flex flex-col gap-4 mb-8">
        {filteredNotice.map((notice) => (
          <div
            key={notice.notificationID}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
                  {notice.title}
                  {notice.type === "SCHOLARSHIP" && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      Học bổng
                    </span>
                  )}
                  {notice.type === "EVENT" && (
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                      Sự kiện
                    </span>
                  )}
                  {notice.type === "DEFAULT" && (
                    <span className="text-xs bg-gray-300 text-gray-800 px-2 py-0.5 rounded">
                      Thông báo
                    </span>
                  )}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-2">{notice.content}</p>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap text-sm text-gray-500 gap-4">
            <div>🕒 Ngày tạo: {new Date(notice.createAt).toLocaleDateString("vi-VN")} </div>

              {notice.scholarship && (
                <>
                  <div>💰 Số tiền: {notice.scholarship.amount.toLocaleString()} VND</div>
                  <div>📅 Hạn nộp: {new Date(notice.scholarship.deadline).toLocaleDateString("vi-VN")} </div>
                </>
              )}
              {notice.event && (
                <>
                  <div>📍 Địa điểm: {notice.event.location}</div>
                  <div>📅 Bắt đầu: {new Date(notice.event.startDate).toLocaleDateString("vi-VN")}</div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    )}
    </div>
  )

  return (
    <div className="p-6 w-full min-w-[80vw] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Thông báo</h1>
        <div className="flex gap-4">
        </div>
      </div>

      {/* Breadcrumb */}
      <Breadcrumb className="border-b border-gray-200 pb-2 mb-6">
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/dashboard/student">Trang chủ</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator><SlashIcon /></BreadcrumbSeparator>
          <BreadcrumbItem><BreadcrumbLink href="/dashboard/student/notifications">Thông báo</BreadcrumbLink></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
            {/* Stats */}
        {renderStats()}


      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <input type="text" placeholder="Tìm theo tiêu đề hoặc người gửi" className="border px-3 py-2 rounded w-full sm:w-72" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <DropdownMenu>
            <DropdownMenuTrigger className="border px-3 py-2 rounded w-full sm:w-auto text-left flex items-center justify-between gap-2">
              <span><span>{filterType}</span></span>
              <ChevronsUpDownIcon className="w-4 h-4 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Lọc theo loại</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilterType("All")}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("DEFAULT")}>DEFAULT</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("SCHOLARSHIP")}>SCHOLARSHIP</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("EVENT")}>EVENT</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

            <DropdownMenu>
    <DropdownMenuTrigger className="border px-3 py-2 rounded w-full sm:w-auto text-left flex items-center justify-between gap-2">
      <span>{sortOrder === "newest" ? "Mới nhất" : "Cũ nhất"}</span>
      <ChevronsUpDownIcon className="w-4 h-4 opacity-50" />
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>Sắp xếp theo ngày</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => setSortOrder("newest")}>Mới nhất</DropdownMenuItem>
      <DropdownMenuItem onClick={() => setSortOrder("oldest")}>Cũ nhất</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
        </div>
      </div>
      {renderNotice()}
    </div>


  )
}
