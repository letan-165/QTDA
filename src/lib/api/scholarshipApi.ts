export type ScholarshipRegistration = {
  registrationID: number
  student: { 
    studentID: string; 
    fullName: string; 
    className: string }
  scholarship: { 
    scholarshipID: number; 
    deadline: string; 
    amount: number; 
    name: string }
  status: "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED"
  createAt: string
}

export async function fetchScholarshipRegistrations(): Promise<ScholarshipRegistration[]> {
  const res = await fetch("http://localhost:8080/api/registration/public/gets")
  if (!res.ok) throw new Error("Không thể tải danh sách đăng ký học bổng")
  return (await res.json()).result
}

export async function changeScholarshipStatus(registrationID: number, status: "PENDING" | "APPROVED" | "REJECTED") {
  const res = await fetch(`http://localhost:8080/api/registration/public/status/${registrationID}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  })
  if (!res.ok) throw new Error("Không thể thay đổi trạng thái")
  return (await res.json()).result
}

