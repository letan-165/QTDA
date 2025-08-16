
import { ScholarshipRegistration } from "./scholarshipApi"

import { getUserData } from "./userApi"

export async function fetchStudentFullName(): Promise<string> {
  try {
    const { fullName } = await getUserData()
    if (!fullName) throw new Error("thiếu fullName")

    return fullName
  } catch (error) {
    console.error(error)
    return ""
  }
}

export async function fetchStudentID(): Promise<string> {
  try {
    const { studentID } = await getUserData()
    if (!studentID) throw new Error("thiếu studentID")

    return studentID
  } catch (error) {
    console.error(error)
    return ""
  }
}

export async function fetchStudentRegistrationsCount(): Promise<number> {
  try {
    const { studentID } = await getUserData()
    if (!studentID) throw new Error("thiếu studentID")

    const res = await fetch(`http://localhost:8080/api/registration/public/gets/student/${studentID}`)
    if (!res.ok) throw new Error("Không thể tải danh sách đăng ký")

    return (await res.json()).result?.length || 0
  } catch {
    return 0
  }
}

export async function fetchStudentSupportRequests(): Promise<number> {
  try {
    const { studentID } = await getUserData()
    if (!studentID) throw new Error("thiếu studentID")

    const res = await fetch(`http://localhost:8080/api/support/public/gets/student/${studentID}`)
    if (!res.ok) throw new Error("Không thể tải danh sách hỗ trợ")

    return (await res.json()).result?.length || 0
  } catch {
    return 0
  }
}

export async function countNotifications(): Promise<number> {
  try {
    const res = await fetch(`http://localhost:8080/api/post/public/gets/notifications`)
    if (!res.ok) throw new Error("Không thể tải danh sách thông báo")

    return (await res.json()).result?.length || 0
  } catch {
    return 0
  }
}

export  async function fetchRecentActivities() {
  try {
    const { studentID } = await getUserData()
    const [scholarships, supports] = await Promise.all([
      fetch(`http://localhost:8080/api/registration/public/gets/student/${studentID}`).then(res => res.json()),
      fetch(`http://localhost:8080/api/support/public/gets/student/${studentID}`).then(res => res.json())
    ])

    const activities = [
      ...scholarships.result.map((item: any) => ({
        title: `Đăng ký học bổng ${item.scholarship?.name || ""}`,
        desc: "Hồ sơ đã được nộp thành công",
        time: new Date(item.createAt).toLocaleString("vi-VN")
      })),
      ...supports.result.map((item: any) => ({
        title: `Yêu cầu hỗ trợ ${item.supportCode || ""}`,
        desc: item.subject || "Đã gửi yêu cầu hỗ trợ",
        time: new Date(item.createAt).toLocaleString("vi-VN")
      }))
    ]

    return activities.sort(
      (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
    )
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function fetchUpcomingEvents() {
  try {
    const res = await fetch(`http://localhost:8080/api/post/public/gets/notifications`)
    if (!res.ok) throw new Error("Không thể tải sự kiện")

    const data = await res.json()
    const now = new Date()

    return (data.result || [])
      .filter((n: any) => n.event && new Date(n.event.startDate) > now)
      .map((n: any) => ({
        title: n.title,
        date: new Date(n.event.startDate).toLocaleDateString("vi-VN"),
        time: new Date(n.event.startDate).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        location: n.event.location,
      }))
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
  } catch {
    return []
  }
}

export async function registerScholarship(scholarshipID: number) {
  try {
    const { studentID } = await getUserData()
    if (!studentID) throw new Error("Thiếu studentID")
    if (!scholarshipID) throw new Error("Thiếu scholarshipID")

    const res = await fetch(`http://localhost:8080/api/registration/public/create`, {
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
  } catch (error: any) {
    throw new Error(error.message || "Có lỗi xảy ra khi đăng ký học bổng")
  }
}

export async function fetchScholarshipRegistrationsByStudent(): Promise<ScholarshipRegistration[]> {
  try {
    const { studentID } = await getUserData()
    if (!studentID) throw new Error("Không tìm thấy studentID của người dùng")

    const res = await fetch("http://localhost:8080/api/registration/public/gets")
    if (!res.ok) throw new Error("Không thể tải danh sách đăng ký học bổng")

    const data = await res.json()
    return (data.result || []).filter(
      (registration: ScholarshipRegistration) => registration.student?.studentID === studentID
    )
  } catch (error) {
    console.error("Lỗi khi fetch danh sách đăng ký học bổng:", error)
    throw error
  }
}

export type TypeReponse = {
  supportTypeID: number
  name: string
  description: string

}

export async function fetchSupportType(): Promise<TypeReponse[]> {
  try {
    const res = await fetch("http://localhost:8080/api/supportType/public/gets")
    if (!res.ok) throw new Error("Không thể tải danh sách loại hỗ trợ")

    const data = await res.json()
    return data.result || []
  } catch (error) {
    console.error("Lỗi khi fetch danh sách loại hỗ trợ:", error)
    throw error
  }
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
  try {
    const { studentID } = await getUserData()
    if (!studentID) throw new Error("Không tìm thấy studentID trong cookie")

    const res = await fetch("http://localhost:8080/api/support/public/create", {
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
  } catch (error) {
    console.error("Lỗi khi tạo yêu cầu hỗ trợ:", error)
    throw error
  }
}


export async function fetchSupportResponses(): Promise<SupportItem[]> {
  try {
    const { studentID } = await getUserData()
    if (!studentID) throw new Error("Không tìm thấy studentID của người dùng")

    const res = await fetch("http://localhost:8080/api/support/public/gets")
    if (!res.ok) throw new Error("Không thể tải danh sách yêu cầu hỗ trợ")

    const data = await res.json()
    return (data.result || []).filter(
      (support: SupportItem) => support.student?.studentID === studentID
    )
  } catch (error) {
    console.error("Lỗi khi fetch danh sách yêu cầu hỗ trợ:", error)
    throw error
  }
}


