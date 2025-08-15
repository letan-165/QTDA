
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
