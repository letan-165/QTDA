import { jwtDecode } from "jwt-decode"

type DecodedToken = {
  sub: string
  id: string
  scope: "ADMIN" | "STUDENT" | "STAFF"
  exp: number
}

export function handleLogin(token: string) {
  const decoded: DecodedToken = jwtDecode(token)
  const role = decoded.scope

  localStorage.setItem("token", token)
  localStorage.setItem("role", role)
  localStorage.setItem("userId", decoded.sub)

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
