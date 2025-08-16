"use client"

import { useEffect, useState } from "react"
import { fetchSupportResponses, createResponse, changeResponseStatus } from "@/lib/api/staffApi"
import { SupportItem, fetchSupportType, TypeReponse } from "@/lib/api/studentApi"
import { toast } from "sonner"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { SlashIcon, ChevronsUpDownIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"

export function ResponsePage() {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")
  const [filterSupportType, setFilterSupportType] = useState("All") // Lọc theo supportType
  const [sortByTime, setSortByTime] = useState("newest")
  const [sortBySupportType, setSortBySupportType] = useState("asc")
  const [feedbacks, setFeedbacks] = useState<SupportItem[]>([])
  const [supportTypes, setSupportTypes] = useState<TypeReponse[]>([]) // Lưu danh sách supportType
  const [selectedFeedback, setSelectedFeedback] = useState<SupportItem | null>(null)
  const [responseContent, setResponseContent] = useState("")

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError("")
        const [feedbackData, supportTypeData] = await Promise.all([
          fetchSupportResponses(),
          fetchSupportType(),
        ])
        setFeedbacks(feedbackData)
        setSupportTypes(supportTypeData)
      } catch (err: any) {
        setError(err.message || "Không thể tải dữ liệu")
        toast.error("Lỗi khi tải dữ liệu")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleCreateResponse = async () => {
    if (!selectedFeedback || !responseContent.trim()) {
      toast.error("Vui lòng nhập nội dung phản hồi")
      return
    }
    try {
      setSubmitting(true)
      const updatedFeedback = await createResponse({
        title: selectedFeedback.title,
        content: responseContent,
        createAt: new Date().toISOString(),
        supportID: selectedFeedback.supportID,
      })
      toast.success("Gửi phản hồi thành công")
      setFeedbacks((prev) =>
        prev.map((fb) => (fb.supportID === selectedFeedback.supportID ? updatedFeedback : fb))
      )
      setSelectedFeedback(updatedFeedback)
      setResponseContent("")
    } catch (err: any) {
      toast.error(err.message || "Gửi phản hồi thất bại")
    } finally {
      setSubmitting(false)
    }
  }

  const handleChangeStatus = async (supportID: number, newStatus: "PENDING" | "COMPLETED") => {
    try {
      setSubmitting(true)
      await changeResponseStatus(supportID, newStatus)
      toast.success(`Cập nhật trạng thái thành ${newStatus === "PENDING" ? "Chờ duyệt" : "Đã hoàn thành"}`)
      setFeedbacks((prev) =>
        prev.map((fb) => (fb.supportID === supportID ? { ...fb, status: newStatus } : fb))
      )
      if (selectedFeedback?.supportID === supportID) {
        setSelectedFeedback({ ...selectedFeedback, status: newStatus })
      }
    } catch (err: any) {
      toast.error(err.message || "Cập nhật trạng thái thất bại")
    } finally {
      setSubmitting(false)
    }
  }

  const filteredFeedbacks = feedbacks
    .filter(
      (fb) =>
        fb.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (filterStatus === "All" || fb.status === filterStatus) &&
        (filterSupportType === "All" || fb.supportType?.supportTypeID === Number(filterSupportType))
    )
    .sort((a, b) => {
      const timeA = new Date(a.createAt).getTime()
      const timeB = new Date(b.createAt).getTime()
      if (sortByTime === "newest") {
        if (timeA !== timeB) return timeB - timeA
      } else {
        if (timeA !== timeB) return timeA - timeB
      }
      const nameA = a.supportType?.name || ""
      const nameB = b.supportType?.name || ""
      return sortBySupportType === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA)
    })

  const renderStats = () => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {[
        { label: "Tổng đơn", count: feedbacks.length, color: "bg-gray-300 text-gray-600" },
        { label: "Chờ duyệt", count: feedbacks.filter((fb) => fb.status === "PENDING").length, color: "bg-red-200 text-red-800" },
        { label: "Hoàn thành", count: feedbacks.filter((fb) => fb.status === "COMPLETED").length, color: "bg-green-200 text-green-800" },
      ].map(({ label, count, color }) => (
        <div key={label} className={`${color} rounded-xl p-4 border shadow`}>
          <p className="text-sm">{label}</p>
          <p className="text-2xl font-semibold">{count}</p>
        </div>
      ))}
    </div>
  )

  const renderFeedback = (fb: SupportItem) => (
    <div
      key={fb.supportID}
      className="border rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-pointer"
      onClick={() => setSelectedFeedback(fb)}
    >
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
          {fb.title}
          <span
            className={`text-xs px-2 py-0.5 rounded ${
              fb.status === "PENDING" ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"
            }`}
          >
            {fb.status === "PENDING" ? "Chờ duyệt" : "Đã hoàn thành"}
          </span>
        </h2>
      </div>
      <p className="text-gray-600 text-sm">{fb.content || "Không có nội dung"}</p>
      <p className="text-gray-600 text-sm">Loại: {fb.supportType?.name || "Không xác định"}</p>
    </div>
  )

  const renderSheet = () => (
    <Sheet open={!!selectedFeedback} onOpenChange={() => setSelectedFeedback(null)}>
      <SheetContent side="right" className="w-96 p-4">
        <SheetHeader>
          <SheetTitle>{selectedFeedback?.title}</SheetTitle>
          <SheetDescription>{selectedFeedback?.content}</SheetDescription>
        </SheetHeader>
        <div className="space-y-2 text-sm text-gray-600 mt-4">
          <div><b>Mã hỗ trợ:</b> {selectedFeedback?.supportID}</div>
          <div><b>Loại hỗ trợ:</b> {selectedFeedback?.supportType?.name || "Chưa có"}</div>
          <div><b>Nhân viên:</b> {selectedFeedback?.response?.staff?.fullName || "Chưa có"}</div>
          <div>
            <b>Ngày phản hồi:</b>{" "}
            {selectedFeedback?.response?.createAt
              ? new Date(selectedFeedback.response.createAt).toLocaleDateString("vi-VN")
              : "Chưa có"}
          </div>
          <div>
            <b>Nội dung phản hồi:</b>
            <div className="mt-2 flex justify-start">
              <div className="bg-blue-100 text-blue-800 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm max-w-[85%] leading-relaxed">
                {selectedFeedback?.response?.content || "Chưa có phản hồi"}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="border px-3 py-2 rounded w-full text-left flex items-center justify-between gap-2">
              <span>Trạng thái: {selectedFeedback?.status || "Chọn trạng thái"}</span>
              <ChevronsUpDownIcon className="w-4 h-4 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Thay đổi trạng thái</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => selectedFeedback && handleChangeStatus(selectedFeedback.supportID, "PENDING")}>
                Chờ duyệt
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => selectedFeedback && handleChangeStatus(selectedFeedback.supportID, "COMPLETED")}>
                Đã hoàn thành
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-6 space-y-3">
          <Textarea
            placeholder="Nhập phản hồi..."
            value={responseContent}
            onChange={(e) => setResponseContent(e.target.value)}
          />
          <Button
            onClick={handleCreateResponse}
            disabled={submitting}
            className="w-full"
          >
            {submitting ? "Đang gửi..." : "Gửi phản hồi"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )

  return (
    <div className="p-6 w-full min-w-[80vw] mx-auto flex">
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-6">Phản hồi hỗ trợ</h1>
        <Breadcrumb className="border-b border-gray-200 pb-2 mb-6">
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="/dashboard/student">Trang chủ</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator><SlashIcon /></BreadcrumbSeparator>
            <BreadcrumbItem><BreadcrumbLink href="/dashboard/student/supports/feedback">Xem phản hồi</BreadcrumbLink></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {renderStats()}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto flex-wrap">
            <Input
              placeholder="Tìm theo tiêu đề"
              className="w-full sm:w-72"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <DropdownMenu>
              <DropdownMenuTrigger className="border px-3 py-2 rounded w-full sm:w-auto text-left flex items-center justify-between gap-2">
                {filterStatus}
                <ChevronsUpDownIcon className="w-4 h-4 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Lọc theo trạng thái</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {["All", "PENDING", "COMPLETED"].map((status) => (
                  <DropdownMenuItem key={status} onClick={() => setFilterStatus(status)}>
                    {status === "All" ? "Tất cả" : status === "PENDING" ? "Chờ duyệt" : "Đã hoàn thành"}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger className="border px-3 py-2 rounded w-full sm:w-auto text-left flex items-center justify-between gap-2">
                {filterSupportType === "All" ? "Tất cả loại hỗ trợ" : supportTypes.find((st) => st.supportTypeID === Number(filterSupportType))?.name || "Tất cả"}
                <ChevronsUpDownIcon className="w-4 h-4 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Lọc theo loại hỗ trợ</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilterSupportType("All")}>Tất cả</DropdownMenuItem>
                {supportTypes.map((st) => (
                  <DropdownMenuItem key={st.supportTypeID} onClick={() => setFilterSupportType(st.supportTypeID.toString())}>
                    {st.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger className="border px-3 py-2 rounded w-full sm:w-auto text-left flex items-center justify-between gap-2">
                {sortByTime === "newest" ? "Mới nhất" : "Cũ nhất"}
                <ChevronsUpDownIcon className="w-4 h-4 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Sắp xếp theo thời gian</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortByTime("newest")}>Mới nhất</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortByTime("oldest")}>Cũ nhất</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
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
        ) : filteredFeedbacks.length === 0 ? (
          <div className="text-center py-10 text-gray-500">Không có phản hồi nào.</div>
        ) : (
          <div className="flex flex-col gap-4 mb-8">
            {filteredFeedbacks.map(renderFeedback)}
          </div>
        )}
      </div>
      {renderSheet()}
    </div>
  )
}