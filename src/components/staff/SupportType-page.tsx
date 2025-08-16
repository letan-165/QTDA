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
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

import {
  SupportType, 
  addSupportType
} from "@/lib/api/staffApi"

import { fetchSupportType, TypeReponse } from "@/lib/api/studentApi"

export function SupportTypePage() {
  const [supportCategories, setSupportCategories] = useState<TypeReponse[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState<SupportType>({
    name: "",
    description: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const supportTypes = await fetchSupportType()
      setSupportCategories(supportTypes)
    } catch (err) {
      console.error(err)
      toast.error("Lỗi khi tải danh mục hỗ trợ")
    } finally {
      setLoading(false)
    }
  }

  const handleAddSupportType = async () => {
    if (!form.name || !form.description) {
      toast.warning("Vui lòng nhập đầy đủ tên và mô tả")
      return
    }

    try {
      setSubmitting(true)
      await addSupportType([form]) 
      toast.success("Thêm danh mục hỗ trợ thành công")
      setForm({ name: "", description: "" })
      await loadData()
    } catch (error) {
      console.error(error)
      toast.error("Thêm danh mục hỗ trợ thất bại")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-6 w-full min-w-[80vw] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý danh mục hỗ trợ</h1>
      </div>

      <Breadcrumb className="border-b border-gray-200 pb-2 mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/staff">Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator><SlashIcon /></BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/staff/support-types">Danh mục hỗ trợ</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 border rounded-lg p-4 shadow-sm bg-white">
          <h2 className="text-lg font-semibold mb-3">Thêm danh mục mới</h2>
          <div>
            <label className="block mb-1 font-medium">Tên danh mục</label>
            <Input
              placeholder="Nhập tên danh mục"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Mô tả</label>
            <Textarea
              placeholder="Nhập mô tả"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="min-h-[120px]"
            />
          </div>
          <button
            onClick={handleAddSupportType}
            disabled={submitting}
            className="bg-black hover:bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {submitting ? "Đang thêm..." : "Thêm danh mục"}
          </button>
        </div>

        <div className="space-y-3 border rounded-lg p-4 shadow-sm bg-white">
          <h2 className="text-lg font-semibold mb-3">Danh sách danh mục hiện có</h2>
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
                  className="border rounded-lg p-4 bg-gray-50"
                >
                  <div className="font-medium">{cat.name}</div>
                  <div className="text-sm text-gray-500">{cat.description}</div>
                </div>
              ))
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
