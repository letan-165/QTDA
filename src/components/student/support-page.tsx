"use client"

import { useState, useEffect } from "react"
import { SlashIcon } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  fetchSupportType, 
  createSupportRequest, 
  TypeReponse, 
  fetchStudentFullName,
  fetchStudentID 
} from "@/lib/api/studentApi"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

export function RequestPage() {
  const [supportCategories, setSupportCategories] = useState<TypeReponse[]>([])
  const [loading, setLoading] = useState(true)
  const [fullName, setFullName] = useState("")
  const [studentID, setStudentID] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    category: "",
    title: "",
    details: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
  try {
    setLoading(true)
    const [supportTypes, fullName, studentID] = await Promise.all([
      fetchSupportType(),
      fetchStudentFullName(),
      fetchStudentID(),
    ])
    setSupportCategories(supportTypes)
    setFullName(fullName) 
    setStudentID(studentID)
  } catch (err) {
    console.error(err)
  } finally {
    setLoading(false)
  }
}

  const handleSubmit = async () => {
    try {
      setSubmitting(true)

      const selectedCategory = supportCategories.find(cat => cat.name === form.category)
      if (!selectedCategory) {
        toast("Vui lòng chọn danh mục hợp lệ")
        return
      }
      const payload = {
        title: form.title,
        content: form.details,
        supportTypeID: selectedCategory.supportTypeID,
      }

      await createSupportRequest(payload)
      toast("Gửi yêu cầu hỗ trợ thành công")
      setForm({ category: "", title: "", details: "" })
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error)
      toast("Gửi yêu cầu thất bại")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-6 w-full min-w-[80vw] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Yêu cầu hỗ trợ</h1>
      </div>
      <Breadcrumb className="border-b border-gray-200 pb-2 mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/student">Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator><SlashIcon /></BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/student/supports/request">Tạo hỗ trợ</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cột trái: Danh mục */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Chọn danh mục hỗ trợ</h2>
          <p className="text-sm text-gray-500">Chọn danh mục phù hợp với vấn đề của bạn</p>
          <ScrollArea className="h-[500px] pr-3">
            {loading ? (
              <div className="flex flex-col gap-4">
                {[...Array(5)].map((_, idx) => (
                  <div key={idx} className="border rounded-lg p-4 shadow animate-pulse space-y-2">
                    <Skeleton className="h-4 bg-gray-200 rounded w-1/2" />
                    <Skeleton className="h-3 bg-gray-200 rounded w-3/4" />
                  </div>
                ))}
              </div>
            ) : (
              supportCategories.map((cat) => (
                <div
                  key={cat.supportTypeID}
                  onClick={() => setForm({ ...form, category: cat.name })}
                  className={`border rounded-lg p-4 cursor-pointer hover:bg-gray-50 ${
                    form.category === cat.name ? "border-blue-500 bg-blue-50" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div>
                      <div className="font-medium">{cat.name}</div>
                      <div className="text-sm text-gray-500">{cat.description}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </div>

        {/* Cột phải: Form */}
        <div className="space-y-4 max-w-2xl">
          <h2 className="text-lg font-semibold">Thông tin yêu cầu</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Họ và tên</label>
              <Input value={fullName || "..."} disabled />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mã sinh viên</label>
              <Input value={studentID || "..."} disabled />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Danh mục được chọn</label>
            <Input
              name="category"
              placeholder="Vui lòng chọn danh mục"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tiêu đề yêu cầu</label>
            <Input
              name="title"
              placeholder="Tóm tắt ngắn gọn vấn đề của bạn"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mô tả chi tiết</label>
            <Textarea
              name="details"
              placeholder="Mô tả chi tiết vấn đề..."
              value={form.details}
              onChange={(e) => setForm({ ...form, details: e.target.value })}
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">Tối đa 500 ký tự</p>
          </div>

          <div className="pt-4">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-900 disabled:opacity-50"
            >
              {submitting ? "Đang gửi..." : "Gửi yêu cầu"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
