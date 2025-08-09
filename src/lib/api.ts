import Cookies from "js-cookie"
//login
export async function loginApi(username: string, password: string): Promise<string> {
  const res = await fetch("http://localhost:8080/api/auth/public/login", {
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

//admin
export type UserResponse = {
  userID: string
  username: string
  role: string
  staff?: {
    position: string
  }
}
export async function fetchAllUsers(): Promise<UserResponse[]> {
  const res = await fetch("http://localhost:8080/api/user/public/gets")

  if (!res.ok) {
    throw new Error("Không thể tải danh sách người dùng")
  }

  const data = await res.json()
  return data.result 
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
  const res = await fetch(`http://localhost:8080/api/user/public/get/${userID}`)

  if (!res.ok) {
    throw new Error("Không thể tải thông tin người dùng")
  }

  const data = await res.json()
  return data.result 
}

//notifications
export type NotificationItem = {
  title: string
  content: string
  notificationID: string
  staffName: string
  createAt: string
  type: "DEFAULT" | "SCHOLARSHIP" | "EVENT"
  scholarship?: {
    deadline: string
    amount: number
  }
  event?: {
    startDate: string
    location: string
  }
}


export type AddNotification = {
  staffID: string
  posts: [
    {
    title: string,
    content: string,
    type: "DEFAULT" | "SCHOLARSHIP" | "EVENT",
    scholarship?: {
      deadline: string,
      amount: number
    },
    event?: {
      startDate: string,
      location: string
    }
    }
  ]
}
export async function fetchNotifications(): Promise<NotificationItem[]> {
  const res = await fetch("http://localhost:8080/api/post/public/gets/notifications")

  if (!res.ok) {
    throw new Error("Không thể tải danh sách thông báo")
  }

  const data = await res.json()
  return data.result // Trả về danh sách thông báo
}
export async function addNotification(notification: AddNotification) {
  const res = await fetch("http://localhost:8080/api/post/public/saves", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(notification),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || "Thêm thông báo thất bại")
  }

  const data = await res.json()
  return data.result // Trả về thông báo đã thêm
}
export async function deleteNotification(notificationIDs: string[]){
  const res = await fetch(`http://localhost:8080/api/post/public/removes`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ notificationIDs }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || "Xoá thông báo thất bại")
  }

  const data = await res.json()
  return data.result // Trả về danh sách ID đã xoá
}

export async function fetchEvents(): Promise<NotificationItem[]> {
  const res = await fetch("http://localhost:8080/api/post/public/gets/envents", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!res.ok) {
    throw new Error("Không thể tải danh sách sự kiện")
  }

  const data = await res.json()
  return data.result 
}

export async function fetchScholarships(): Promise<NotificationItem[]> {
  const res = await fetch("http://localhost:8080/api/post/public/gets/scholarships", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!res.ok) {
    throw new Error("Không thể tải danh sách sự kiện")
  }

  const data = await res.json()
  return data.result 
}

export type ScholarshipRegistration = {
  registrationID: number;
  student: {
    studentID: string;
    fullName: string;
    className: string;
  };
  scholarship: {
    scholarshipID: number;
    deadline: string; 
    amount: number;
  };
  status: "PENDING" | "APPROVED" | "REJECTED"; 
  createAt: string; 
}

export type changeStatus = {
  registrationID: number;
  status: "PENDING" | "APPROVED" | "REJECTED"; 
}
export async function fetchScholarshipRegistrations(): Promise<ScholarshipRegistration[]> {
  try {
    const res = await fetch("http://localhost:8080/api/registration/public/gets");

    if (!res.ok) {
      throw new Error("Không thể tải danh sách đăng ký học bổng");
    }

    const data = await res.json();
    return data.result;
  } catch (error) {
    console.error("Lỗi khi fetch danh sách đăng ký học bổng:", error);
    throw error;
  }
}

export async function changeScholarshipStatus(
  registrationID: number,
  status: "PENDING" | "APPROVED" | "REJECTED"
): Promise<ScholarshipRegistration> {
  const res = await fetch(`http://localhost:8080/api/registration/public/status/${registrationID}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) throw new Error("Không thể thay đổi trạng thái");
  const data = await res.json();
  return data.result;
}

//student
export async function getUserData() {
  const userID = Cookies.get("userId")
  if (!userID) throw new Error("Không tìm thấy userID trong cookie")

  const res = await fetch(`http://localhost:8080/api/user/public/get/${userID}`)
  if (!res.ok) throw new Error("Không thể tải thông tin người dùng")

  const data = await res.json()
  return data.result?.student || {}
}

export async function fetchStudentRegistrationsCount(): Promise<number> {
  try {
    const { studentID } = await getUserData()
    if (!studentID) throw new Error("thiếu studentID")

    const res = await fetch(`http://localhost:8080/api/registration/public/gets/student/${studentID}`)
    if (!res.ok) throw new Error("Không thể tải danh sách đăng ký")

    const data = await res.json()
    return data.result?.length || 0
  } catch (error) {
    console.error(error)
    return 0
  }
}

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

export async function fetchStudentSupportRequests(): Promise<number> {
  try {
    const { studentID } = await getUserData()
    if (!studentID) throw new Error("thiếu studentID")

    const res = await fetch(`http://localhost:8080/api/support/public/gets/student/${studentID}`)
    if (!res.ok) throw new Error("Không thể tải danh sách hỗ trợ")

    const data = await res.json()
    return data.result?.length || 0
  } catch (error) {
    console.error(error)
    return 0
  }
}

export async function countNotifications(): Promise<number> {
  try {
    const res = await fetch(`http://localhost:8080/api/post/public/gets/notifications`)
    if (!res.ok) throw new Error("Không thể tải danh sách thông báo")

    const data = await res.json()
    return data.result?.length || 0
  } catch (error) {
    console.error(error)
    return 0
  }
}

export async function fetchUpcomingEvents() {
  try {
    const res = await fetch(`http://localhost:8080/api/post/public/gets/notifications`)
    if (!res.ok) throw new Error("Không thể tải sự kiện")
    const data = await res.json()

    const now = new Date()
    const events = (data.result || [])
      .filter((n: any) => n.event && new Date(n.event.startDate) > now)
      .map((n: any) => ({
        title: n.title,
        date: new Date(n.event.startDate).toLocaleDateString("vi-VN"),
        time: new Date(n.event.startDate).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        location: n.event.location
      }))
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return events
  } catch (error) {
    console.error(error)
    return []
  }
}



