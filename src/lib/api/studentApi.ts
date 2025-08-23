import { ScholarshipRegistration } from "./scholarshipApi"
import { getUserData } from "./userApi"
import { API_BASE } from "./index"

export async function fetchFullName(): Promise<string> {
  const { fullName } = await getUserData()
  if (!fullName) throw new Error("thiếu fullName")
  return fullName
}

export async function fetchStudentID(): Promise<string> {
  const { studentID } = await getUserData()
  if (!studentID) throw new Error("thiếu studentID")
  return studentID
}

export async function fetchStudentRegistrationsCount(): Promise<number> {
  const { studentID } = await getUserData()
  if (!studentID) throw new Error("thiếu studentID")

  const res = await fetch(`${API_BASE}/api/registration/public/gets/student/${studentID}`)
  if (!res.ok) throw new Error("Không thể tải danh sách đăng ký")

  return (await res.json()).result?.length || 0
}

export async function fetchStudentSupportRequests(): Promise<number> {
  const { studentID } = await getUserData()
  if (!studentID) throw new Error("thiếu studentID")

  const res = await fetch(`${API_BASE}/api/support/public/gets/student/${studentID}`)
  if (!res.ok) throw new Error("Không thể tải danh sách hỗ trợ")

  return (await res.json()).result?.length || 0
}

export async function countNotifications(): Promise<number> {
  const res = await fetch(`${API_BASE}/api/post/public/gets/notifications`)
  if (!res.ok) throw new Error("Không thể tải danh sách thông báo")

  return (await res.json()).result?.length || 0
}

export async function fetchRecentActivities() {
  const { studentID } = await getUserData()
  if (!studentID) throw new Error("thiếu studentID")

  const [scholarships, supports] = await Promise.all([
    fetch(`${API_BASE}/api/registration/public/gets/student/${studentID}`).then(res => res.json()),
    fetch(`${API_BASE}/api/support/public/gets/student/${studentID}`).then(res => res.json())
  ])

  const activities = [
    ...((scholarships.result || []) as Array<{ scholarship?: { name?: string }, createAt: string }>).map((item) => ({
      title: `Đăng ký học bổng ${item.scholarship?.name || ""}`,
      desc: "Hồ sơ đã được nộp thành công",
      time: new Date(item.createAt).toLocaleString("vi-VN")
    })),
    ...((supports.result || []) as Array<{ supportCode?: string, subject?: string, createAt: string }>).map((item) => ({
      title: `Yêu cầu hỗ trợ ${item.supportCode || ""}`,
      desc: item.subject || "Đã gửi yêu cầu hỗ trợ",
      time: new Date(item.createAt).toLocaleString("vi-VN")
    }))
  ]

  return activities.sort(
    (a: { time: string }, b: { time: string }) => new Date(b.time).getTime() - new Date(a.time).getTime()
  )
}

export async function fetchUpcomingEvents() {
  const res = await fetch(`${API_BASE}/api/post/public/gets/notifications`)
  if (!res.ok) throw new Error("Không thể tải sự kiện")

  const data = await res.json()
  const now = new Date()

  return (data.result || [])
    .filter((n: { event?: { startDate: string } }) => n.event && new Date(n.event.startDate) > now)
    .map((n: { title: string, event: { startDate: string, location: string } }) => ({
      title: n.title,
      date: new Date(n.event.startDate).toLocaleDateString("vi-VN"),
      time: new Date(n.event.startDate).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      location: n.event.location,
    }))
    .sort(
      (a: { date: string }, b: { date: string }) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    )
}

export async function registerScholarship(scholarshipID: number) {
  const { studentID } = await getUserData()
  if (!studentID) throw new Error("Thiếu studentID")
  if (!scholarshipID) throw new Error("Thiếu scholarshipID")

  const res = await fetch(`${API_BASE}/api/registration/public/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentID, scholarshipID }),
  })

  const data = await res.json()
  if (!res.ok) {
    if (data?.errorCode === "STUDENT_REGISTERED") {
      throw new Error("Bạn đã đăng ký học bổng này rồi")
    }
    throw new Error(data?.message || "Đăng ký học bổng thất bại")
  }

  return data
}

export async function fetchScholarshipRegistrationsByStudent(): Promise<ScholarshipRegistration[]> {
  const { studentID } = await getUserData()
  if (!studentID) throw new Error("Không tìm thấy studentID của người dùng")

  const res = await fetch(`${API_BASE}/api/registration/public/gets`)
  if (!res.ok) throw new Error("Không thể tải danh sách đăng ký học bổng")

  const data = await res.json()
  return (data.result || []).filter(
    (registration: ScholarshipRegistration) => registration.student?.studentID === studentID
  )
}

export type TypeReponse = {
  supportTypeID: number
  name: string
  description: string
}

export async function fetchSupportType(): Promise<TypeReponse[]> {
  const res = await fetch(`${API_BASE}/api/supportType/public/gets`)
  if (!res.ok) throw new Error("Không thể tải danh sách loại hỗ trợ")

  const data = await res.json()
  return data.result || []
}

export type SupportRequestInput = {
  title: string
  content: string
  supportTypeID: number
}

export type SupportItem = {
  title: string
  content: string
  createAt: string
  supportID: number
  status: "PENDING" | "COMPLETED"
  student: {
    studentID: string
    fullName: string
    className: string
  }
  supportType: {
    supportTypeID: number
    name: string
    description: string
  }
  response: {
    title: string
    content: string
    createAt: string
    responseID: number
    staff: {
      staffID: string
      fullName: string
      position: string
    }
  } | null 
}

export async function createSupportRequest(request: SupportRequestInput): Promise<SupportItem[]> {
  const { studentID } = await getUserData()
  if (!studentID) throw new Error("Không tìm thấy studentID trong cookie")

  const res = await fetch(`${API_BASE}/api/support/public/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...request, studentID }),
  })

  if (!res.ok) {
    const errData = await res.json().catch(() => null)
    throw new Error(errData?.message || "Không thể tạo yêu cầu hỗ trợ")
  }

  const data = await res.json()
  return data.result || []
}

export async function fetchSupportResponses(): Promise<SupportItem[]> {
  const { studentID } = await getUserData()
  if (!studentID) throw new Error("Không tìm thấy studentID của người dùng")

  const res = await fetch(`${API_BASE}/api/support/public/gets`)
  if (!res.ok) throw new Error("Không thể tải danh sách yêu cầu hỗ trợ")

  const data = await res.json()
  return (data.result || []).filter(
    (support: SupportItem) => support.student?.studentID === studentID
  )
}
