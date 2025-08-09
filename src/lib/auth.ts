import { jwtDecode } from "jwt-decode"
import Cookies from "js-cookie"

type DecodedToken = {
  sub: string
  id: string
  scope: "ADMIN" | "STUDENT" | "STAFF"
  exp: number
}

export function handleLogin(token: string) {
  const decoded: DecodedToken = jwtDecode(token)
  const role = decoded.scope

  // Lưu vào cookie thay vì localStorage
  Cookies.set("token", token, { expires: 1 }) // 1 ngày
  Cookies.set("role", role, { expires: 1 })
  Cookies.set("userId", decoded.sub, { expires: 1 })

  // Điều hướng theo role
  switch (role) {
    case "ADMIN":
      window.location.href = "/dashboard/admin/accounts"
      break
    case "STUDENT":
      window.location.href = "/dashboard/student"
      break
    case "STAFF":
      window.location.href = "/dashboard/staff"
      break
    default:
      window.location.href = "/dashboard"
  }
}
