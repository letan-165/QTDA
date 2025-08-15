export type UserResponse = {
  userID: string
  username: string
  role: string
  staff?: { position: string }
}

export type NewUser = {
  fullName: string
  email: string
  phone: string
  userID: string
  username: string
  password: string
  role: string
  staff?: { position: string }
  student?: { dateOfBirth: string; gender: string; className: string }
}


export type UpdateStudent = {
  fullName: string
  email: string
  phone: string
  userID: string
  username: string
  role: string
  password: string
  confirmPassword: string
  student?: { dateOfBirth: string; gender: string; className: string }
}

export type changePassword ={
  userID: string
  password: string
  confirmPassword: string
}

export async function updatePassword(users: changePassword[]) {
  const res = await fetch("http://localhost:8080/api/user/public/saves", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ users }),
  })
  if (!res.ok) throw new Error((await res.json()).error || "Đăng ký người dùng thất bại")
  return (await res.json()).result
}



export type UserDetail = {
  userID: string
  username: string
  password: string
  role: "STAFF" | "STUDENT"
  staff?: { fullName: string; phone: string; email: string; position: string }
  student?: { fullName: string; phone: string; email: string; dateOfBirth: string; gender: string; className: string }
}

export async function fetchAllUsers(): Promise<UserResponse[]> {
  const res = await fetch("http://localhost:8080/api/user/public/gets")
  if (!res.ok) throw new Error("Không thể tải danh sách người dùng")
  return (await res.json()).result
}

export async function signUpUsers(users: NewUser[]) {
  const res = await fetch("http://localhost:8080/api/user/public/saves", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ users }),
  })
  if (!res.ok) throw new Error((await res.json()).error || "Đăng ký người dùng thất bại")
  return (await res.json()).result
}



export async function updateStudent(users: UpdateStudent[]) {
  const res = await fetch("http://localhost:8080/api/user/public/saves", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ users }),
  })
  if (!res.ok) throw new Error((await res.json()).error || "Đăng ký người dùng thất bại")
  return (await res.json()).result
}


export async function deleteUsers(userIDs: string[]) {
  const res = await fetch("http://localhost:8080/api/user/public/removes", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userIDs }),
  })
  if (!res.ok) throw new Error((await res.json()).error || "Xoá người dùng thất bại")
  return (await res.json()).result
}

export async function fetchUserDetail(userID: string): Promise<UserDetail> {
  const res = await fetch(`http://localhost:8080/api/user/public/get/${userID}`)
  if (!res.ok) throw new Error("Không thể tải thông tin người dùng")
  return (await res.json()).result
}

