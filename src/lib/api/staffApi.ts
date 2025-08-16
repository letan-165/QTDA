import { SupportItem } from "./studentApi"
import Cookies from "js-cookie"

export type SupportType = {
  name: string
  description: string
}

export async function addSupportType(supportTypes: SupportType[]) {
  const res = await fetch("http://localhost:8080/api/supportType/public/saves", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ supportTypes }), 
  })
  
  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.error || "Đăng ký danh mục hỗ trợ thất bại")
  }

  return (await res.json()).result
}

export async function fetchSupportResponses(): Promise<SupportItem[]> {
  try {
    const res = await fetch("http://localhost:8080/api/support/public/gets")
    if (!res.ok) throw new Error("Không thể tải danh sách yêu cầu hỗ trợ")

    const data = await res.json()
    return (data.result || [])
  } catch (error) {
    console.error("Lỗi khi fetch danh sách yêu cầu hỗ trợ:", error)
    throw error
  }
}

export type CreateResponseInput = {
  title: string
  content: string
  createAt: string  
  supportID: number
  staffID: string
}

export async function getUserData() {
  const userID = Cookies.get("userId")
  if (!userID) throw new Error("Không tìm thấy userID trong cookie")

  const res = await fetch(`http://localhost:8080/api/user/public/get/${userID}`)
  if (!res.ok) throw new Error("Không thể tải thông tin người dùng")

  return (await res.json()).result?.staff || {}
}



export async function createResponse(
  data: Omit<CreateResponseInput, "staffID"> // bỏ staffID khỏi input
): Promise<SupportItem> {
  try {
    const staff = await getUserData()
    if (!staff?.staffID) throw new Error("Không tìm thấy staffID của người dùng")

    const res = await fetch("http://localhost:8080/api/response/public/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        staffID: staff.staffID, // tự động gắn staffID
      }),
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      throw new Error(errorData.message || "Tạo response thất bại")
    }

    const result = await res.json()
    return result.result as SupportItem
  } catch (error) {
    console.error("Lỗi khi tạo response:", error)
    throw error
  }
}

export async function changeResponseStatus(supportID: number, status: "PENDING" | "COMPLETED" ) {
  const res = await fetch(`http://localhost:8080/api/support/public/status/${supportID}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  })
  if (!res.ok) throw new Error("Không thể thay đổi trạng thái")
  return (await res.json()).result
}
