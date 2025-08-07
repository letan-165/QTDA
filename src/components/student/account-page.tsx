"use client"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"

type StudentInfo = {
  studentId: string
  name: string
  email: string
  major: string
  className: string
  phone: string
}

export  function StudentDashboardPage() {
  const [student, setStudent] = useState<StudentInfo | null>(null)

  useEffect(() => {
    // Giả lập API với dữ liệu mock
    setTimeout(() => {
      setStudent({
        studentId: "2251120373",
        name: "Trần Hoàng Phú",
        email: "student1@example.com",
        major: "Công nghệ thông tin",
        className: "DHKTPM18A",
        phone: "0912345678",
      })
    }, 800) // Delay giả lập gọi API
  }, [])

  return (
    <Card className="max-w-4xl mx-auto mt-10">
      <CardHeader>
        <CardTitle>Thông tin sinh viên</CardTitle>
      </CardHeader>
      <CardContent>
        {student ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã sinh viên</TableHead>
                <TableHead>Họ tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Ngành</TableHead>
                <TableHead>Lớp</TableHead>
                <TableHead>Số điện thoại</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{student.studentId}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.major}</TableCell>
                <TableCell>{student.className}</TableCell>
                <TableCell>{student.phone}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ) : (
          <p className="text-muted-foreground">Đang tải thông tin sinh viên...</p>
        )}
      </CardContent>
    </Card>
  )
}
