
export async function loginApi(username: string, password: string): Promise<string> {
  const res = await fetch("http://localhost:8080/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })

  if (!res.ok) {
    const errData = await res.json()
    throw new Error(errData.error || "Đăng nhập thất bại")
  }

  const data = await res.json()

  const token = data.result
  if (!token || typeof token !== "string") {
    throw new Error("Token không hợp lệ hoặc không tồn tại")
  }

  return token
}
// lib/api.ts

export async function fetchAllUsers() {
  const res = await fetch("http://localhost:8080/api/user/public/gets", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!res.ok) {
    throw new Error("Không thể tải danh sách người dùng")
  }

  const data = await res.json()
  return data.result // Trả về danh sách UserResponse
}

export type UserResponse = {
  userID: string
  username: string
  role: string
  staff?: {
    position: string
  }
}

export type NewUser = {
  fullName: string
  email: string
  phone: string
  userID: string
  username: string
  password: string
  role: string
  staff?: {
    position: string
  }
  student?: {
    dateOfBirth: string
    gender: string
    className: string
  }
}

export type UserDetail = {
  userID: string
  username: string
  password: string
  role: "STAFF" | "STUDENT"
  staff?: {
    fullName: string
    phone: string
    email: string
    position: string
  }
  student?: {
    fullName: string
    phone: string
    email: string
    dateOfBirth: string
    gender: string
    className: string
  }
}




export async function signUpUsers(users: NewUser[]) {
  const res = await fetch("http://localhost:8080/api/user/public/saves", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ users }), 
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || "Đăng ký người dùng thất bại")
  }

  const data = await res.json()
  return data.result 
}


export async function deleteUsers(userIDs: string[]) {
  const res = await fetch("http://localhost:8080/api/user/public/removes", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userIDs }), 
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || "Xoá người dùng thất bại")
  }

  const data = await res.json()
  return data.result // Trả về danh sách ID đã xoá
}
export async function fetchUserDetail(userID: string): Promise<UserDetail> {
  const res = await fetch(`http://localhost:8080/api/user/public/get/${userID}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!res.ok) {
    throw new Error("Không thể tải thông tin người dùng")
  }

  const data = await res.json()
  return data.result // Trả về chi tiết người dùng
}