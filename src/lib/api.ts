
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
export type UserResponse = {
  userID: string
  username: string
  role: string
  staff?: {
    position: string
  }
}
export async function fetchAllUsers(): Promise<UserResponse[]> {
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

export type NotificationItem = {
  title: string
  content: string
  notificationID: string
  staffName: string
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
  const res = await fetch("http://localhost:8080/api/post/public/gets/notifications", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

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
    const res = await fetch("http://localhost:8080/api/registration/public/gets", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

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
// api.ts
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
