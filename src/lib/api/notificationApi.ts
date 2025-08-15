export type NotificationItem = {
  title: string
  content: string
  notificationID: string
  staffName: string
  createAt: string
  type: "DEFAULT" | "SCHOLARSHIP" | "EVENT"
  scholarship?: { scholarshipID: number; deadline: string; amount: number; name: string }
  event?: { startDate: string; location: string }
}

export type AddNotification = {
  staffID: string
  posts: [
    {
      title: string
      content: string
      type: "DEFAULT" | "SCHOLARSHIP" | "EVENT"
      scholarship?: { deadline: string; amount: number; name: string }
      event?: { startDate: string; location: string }
    }
  ]
}

export async function fetchNotifications(): Promise<NotificationItem[]> {
  const res = await fetch("http://localhost:8080/api/post/public/gets/notifications")
  if (!res.ok) throw new Error("Không thể tải danh sách thông báo")
  return (await res.json()).result
}

export async function addNotification(notification: AddNotification) {
  const res = await fetch("http://localhost:8080/api/post/public/saves", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(notification),
  })
  if (!res.ok) throw new Error((await res.json()).error || "Thêm thông báo thất bại")
  return (await res.json()).result
}

export async function deleteNotification(notificationIDs: string[]) {
  const res = await fetch("http://localhost:8080/api/post/public/removes", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ notificationIDs }),
  })
  if (!res.ok) throw new Error((await res.json()).error || "Xoá thông báo thất bại")
  return (await res.json()).result
}
