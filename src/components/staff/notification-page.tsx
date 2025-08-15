
"use client"

import { useEffect, useState, ChangeEvent } from "react"
import { addNotification, fetchNotifications, AddNotification, NotificationItem, deleteNotification } from "@/lib/api/notificationApi"
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
import { SlashIcon, TrashIcon as DeleteIcon, ChevronsUpDownIcon, EyeIcon as ViewIcon, PencilIcon, EyeIcon, TrashIcon,
   Server, CalendarDays, GraduationCap
 } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"



import { Textarea } from "@/components/ui/textarea"
export function NotificationPage() {
  const [notices, setNotice] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("All")
  
const [newNotification, setNewNotification] = useState<AddNotification>({
  staffID: "",
  posts: [
    {
      title: "",
      content: "",
      type: "DEFAULT",
      scholarship: undefined,
      event: undefined,
    },
  ],
});
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
  const handleAddNotice = async () => {
    if (!newNotification.posts[0].title.trim() || !newNotification.posts[0].content.trim()) {
      toast.error("Vui lòng nhập đầy đủ thông tin")
      return
    }
    try {
      await addNotification(newNotification)
      await loadNotification()
      toast.success("Thêm thông báo thành công!")

      setNewNotification({
        staffID: "",
        posts: [
          {
            title: "",
            content: "",
            type: "DEFAULT",
            scholarship: undefined,
            event: undefined,
          }
        ],
      });
    } catch (err: any) {
      toast.error(err.message || "Thêm thông báo thất bại.")
    }
      }
    const handleDelete = async (id: string) => {
      try {
        await deleteNotification([id])
        setNotice(notices.filter((u) => u.notificationID !== id))

        toast.success(`Đã xoá thông báo có id: ${id}`)
      } catch (err: any) {
        toast.error(err.message || "Xoá thông báo thất bại.")
      }
    }

    const filteredNotice = notices.filter((notice) => {
    const matchesSearch =
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.staffName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = filterType === "All" || notice.type === filterType

    return matchesSearch && matchesType
  })

  return (
    <div className="p-6 w-full min-w-[80vw] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý thông báo</h1>
        <div className="flex gap-4">
    <Dialog>
          <DialogTrigger className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-900">
            + Thêm thông báo
          </DialogTrigger>
          <DialogContent className="max-w-2xl w-full">
            <DialogHeader>
              <DialogTitle>Thêm thông báo mới</DialogTitle>
              <DialogDescription>Nhập thông tin để tạo thông báo.</DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <Input
                type="text"
                placeholder="Tiêu đề thông báo"
                value={newNotification.posts[0].title}
                onChange={(e) =>
                  setNewNotification((prev) => ({
                    ...prev,
                    posts: [{ ...prev.posts[0], title: e.target.value }],
                  }))
                }
              />

              <Textarea
                placeholder="Nội dung thông báo"
                value={newNotification.posts[0].content}
                onChange={(e) =>
                  setNewNotification((prev) => ({
                    ...prev,
                    posts: [{ ...prev.posts[0], content: e.target.value }],
                  }))
                }
              />

              <Input
                type="text"
                placeholder="Staff ID"
                value={newNotification.staffID}
                onChange={(e) =>
                  setNewNotification((prev) => ({
                    ...prev,
                    staffID: e.target.value,
                  }))
                }
              />

              <DropdownMenu>
                <DropdownMenuTrigger className="border px-2 py-1 rounded w-full text-left">
                  {newNotification.posts[0].type}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Chọn loại</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {["DEFAULT", "SCHOLARSHIP", "EVENT"].map((type) => (
                    <DropdownMenuItem
                      key={type}
                      onSelect={() =>
                        setNewNotification((prev) => ({
                          ...prev,
                          posts: [
                            {
                              ...prev.posts[0],
                              type: type as "DEFAULT" | "SCHOLARSHIP" | "EVENT",
                              scholarship: type === "SCHOLARSHIP" ? { deadline: "", amount: 0, name:"" } : undefined,
                              event: type === "EVENT" ? { startDate: "", location: "" } : undefined,
                            },
                          ],
                        }))
                      }
                    >
                      {type}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/*  SCHOLARSHIP */}
                {newNotification.posts[0].type === "SCHOLARSHIP" && (
                  <>
                    <Input
                      type="text"
                      placeholder="Tên học bổng"
                      value={newNotification.posts[0].scholarship?.name || ""}
                      onChange={(e) =>
                        setNewNotification((prev) => ({
                          ...prev,
                          posts: [
                            {
                              ...prev.posts[0],
                              scholarship: {
                                ...prev.posts[0].scholarship,
                                name: e.target.value,
                                deadline: prev.posts[0].scholarship?.deadline || "",
                                amount: prev.posts[0].scholarship?.amount || 0,
                              },
                            },
                          ],
                        }))
                      }
                    />

                    <Input
                      type="date"
                      placeholder="Hạn đăng ký học bổng"
                      value={newNotification.posts[0].scholarship?.deadline.split("T")[0] || ""}
                      onChange={(e) =>
                        setNewNotification((prev) => ({
                          ...prev,
                          posts: [
                            {
                              ...prev.posts[0],
                              scholarship: {
                                ...prev.posts[0].scholarship,
                                deadline: `${e.target.value}T00:00:00Z`,
                                amount: prev.posts[0].scholarship?.amount || 0,
                                name: prev.posts[0].scholarship?.name || "",
                              },
                            },
                          ],
                        }))
                      }
                    />

                    <Input
                      type="number"
                      placeholder="Số tiền học bổng"
                      value={newNotification.posts[0].scholarship?.amount || ""}
                      onChange={(e) =>
                        setNewNotification((prev) => ({
                          ...prev,
                          posts: [
                            {
                              ...prev.posts[0],
                              scholarship: {
                                ...prev.posts[0].scholarship,
                                amount: parseFloat(e.target.value) || 0,
                                deadline: prev.posts[0].scholarship?.deadline || "",
                                name: prev.posts[0].scholarship?.name || "",
                              },
                            },
                          ],
                        }))
                      }
                    />
                  </>
                )}


              {/* EVENT */}
              {newNotification.posts[0].type === "EVENT" && (
                <>
                  <Input
                    type="date"
                    placeholder="Ngày tổ chức sự kiện"
                    value={newNotification.posts[0].event?.startDate.split("T")[0] || ""}
                    onChange={(e) =>
                      setNewNotification((prev) => ({
                        ...prev,
                        posts: [
                          {
                            ...prev.posts[0],
                            event: {
                              ...prev.posts[0].event,
                              startDate: `${e.target.value}T00:00:00Z`,
                              location: prev.posts[0].event?.location || "",
                            },
                          },
                        ],
                      }))
                    }
                  />
                  <Input
                    type="text"
                    placeholder="Địa điểm"
                    value={newNotification.posts[0].event?.location || ""}
                    onChange={(e) =>
                      setNewNotification((prev) => ({
                        ...prev,
                        posts: [
                          {
                            ...prev.posts[0],
                            event: {
                              ...prev.posts[0].event,
                              location: e.target.value,
                              startDate: prev.posts[0].event?.startDate || "",
                            },
                          },
                        ],
                      }))
                    }
                  />
                </>
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleAddNotice}
                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-900"
              >
                Thêm thông báo
              </button>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Breadcrumb */}
      <Breadcrumb className="border-b border-gray-200 pb-2 mb-6">
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/dashboard/admin">Admin</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator><SlashIcon /></BreadcrumbSeparator>
          <BreadcrumbItem><BreadcrumbLink href="/dashboard/admin/notifications">Notices</BreadcrumbLink></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
            {/* Stats */}
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



      {/* Bộ lọc tìm kiếm */}
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
        </div>
      </div>

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
              <div className="flex gap-2 items-center">
                <button onClick={() => handleDelete(notice.notificationID)}>
                <TrashIcon className="w-4 h-4 text-red-500 cursor-pointer" />
                </button>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap text-sm text-gray-500 gap-4">
              <div>👤 Người gửi: {notice.staffName}</div>
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
}
