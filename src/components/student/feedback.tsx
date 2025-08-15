"use client"

import { useEffect, useState } from "react"
import { fetchSupportResponses, SupportItem } from "@/lib/api/studentApi"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SlashIcon, ChevronsUpDownIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

export function SupportFeedbackPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")
  const [feedbacks, setFeedbacks] = useState<SupportItem[]>([])
  const [selectedFeedback, setSelectedFeedback] = useState<SupportItem | null>(null)

  useEffect(() => {
    loadFeedbacks()
  }, [])

  const loadFeedbacks = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await fetchSupportResponses()
      setFeedbacks(data)
    } catch (err: any) {
      setError(err.message || "Không thể tải phản hồi hỗ trợ")
      toast.error("Lỗi khi tải phản hồi hỗ trợ.")
    } finally {
      setLoading(false)
    }
  }

  const filteredStatus = feedbacks.filter((feedback) => {
    const matchesSearch = feedback.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "All" || feedback.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-6 w-full min-w-[80vw] mx-auto flex">
      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Phản hồi hỗ trợ</h1>
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
              <BreadcrumbLink href="/dashboard/student/supports/feedback">
                Xem phản hồi
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Thống kê */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="w-full bg-gray-300 rounded-xl p-4 border shadow">
            <p className="text-sm text-gray-600">Tổng đơn</p>
            <p className="text-2xl font-semibold">{feedbacks.length}</p>
          </div>

          <div className="w-full bg-red-200 rounded-xl p-4 border shadow">
            <p className="text-sm text-red-800">Chờ duyệt</p>
            <p className="text-2xl font-semibold text-red-800">
              {feedbacks.filter(fb => fb.status === "PENDING").length}
            </p>
          </div>

          <div className="w-full bg-green-200 rounded-xl p-4 border shadow">
            <p className="text-sm text-green-800">Hoàn thành</p>
            <p className="text-2xl font-semibold text-green-800">
              {feedbacks.filter(fb => fb.status === "COMPLETED").length}
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <input
              type="text"
              placeholder="Tìm theo tiêu đề"
              className="border px-3 py-2 rounded w-full sm:w-72"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <DropdownMenu>
              <DropdownMenuTrigger className="border px-3 py-2 rounded w-full sm:w-auto text-left flex items-center justify-between gap-2">
                <span>{filterStatus}</span>
                <ChevronsUpDownIcon className="w-4 h-4 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Lọc theo loại hỗ trợ</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilterStatus("All")}>Tất cả</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("PENDING")}>Chờ duyệt</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("COMPLETED")}>Đã hoàn thành</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Feedback List */}
        {loading ? (
          <div className="flex flex-col gap-4">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="border rounded-lg p-4 shadow animate-pulse space-y-2">
                <Skeleton className="h-4 bg-gray-200 rounded w-1/4" />
                <Skeleton className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : filteredStatus.length === 0 ? (
          <div className="text-center py-10 text-gray-500">Không có phản hồi nào.</div>
        ) : (
          <div className="flex flex-col gap-4 mb-8">
            {filteredStatus.map((fb) => (
              <div
                key={fb?.supportID}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-pointer"
                onClick={() => setSelectedFeedback(fb)}
              >
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
                    {fb.title}
                    {fb.status === "PENDING" && (
                      <span className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded">Chờ duyệt</span>
                    )}
                    {fb.status === "COMPLETED" && (
                      <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded">Đã hoàn thành</span>
                    )}
                  </h2>
                </div>
                <p className="text-gray-600 text-sm">{fb?.content || "Không có nội dung"}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sheet Component */}
      <Sheet open={!!selectedFeedback} onOpenChange={() => setSelectedFeedback(null)}>
        <SheetContent side="right" className="w-80 p-4">
          <SheetHeader>
            <SheetTitle>{selectedFeedback?.title}</SheetTitle>
            <SheetDescription>{selectedFeedback?.content}</SheetDescription>
          </SheetHeader>
          <div className="space-y-2 text-sm text-gray-600 mt-4">
            <div><b>Mã hỗ trợ:</b> {selectedFeedback?.supportID}</div>
            <div><b>Nhân viên:</b> {selectedFeedback?.response?.staff?.fullName || "Chưa có"}</div>
            <div>
              <b>Ngày phản hồi:</b>{" "}
              {selectedFeedback?.createAt
                ? new Date(selectedFeedback.createAt).toLocaleDateString("vi-VN")
                : "Không rõ"}
            </div>
            <div>
              <b>Nội dung phản hồi:</b>
            <div className="mt-2 flex justify-start">
              <div className="bg-blue-100 text-blue-800 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm max-w-[75%] leading-relaxed">
                {selectedFeedback?.response?.content || "Chưa có phản hồi"}
              </div>
            </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}