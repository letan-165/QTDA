"use client"

import { useEffect, useState } from "react"
import { fetchAllUsers, signUpUsers, NewUser, UserResponse, deleteUsers, UserDetail, fetchUserDetail } from "@/lib/api"
import { toast } from "sonner"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb"
import { SlashIcon, DeleteIcon, ChevronsUpDownIcon, EyeIcon as ViewIcon } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"

import { Input } from "./ui/input"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Skeleton } from "./ui/skeleton"

export function AccountPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRole, setFilterRole] = useState("All")
  const [users, setUsers] = useState<UserResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 4

  const [newUser, setNewUser] = useState<NewUser>({
    userID: "",
    username: "",
    password: "",
    role: "STUDENT",
    fullName: "",
    email: "",
    phone: "",
    staff: undefined,
    student: {
      dateOfBirth: "",
      gender: "",
      classname: "",
    },
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await fetchAllUsers()
      setUsers(data)
      setCurrentPage(1) // Reset to first page when loading new data
    } catch (err: any) {
      setError(err.message)
      toast.error("Lỗi tải dữ liệu người dùng.")
    } finally {
      setLoading(false)
    }
  }

  const handleAddUser = async () => {
    if (!newUser.userID.trim() || !newUser.username.trim() || !newUser.password.trim()) {
      toast.error("Vui lòng nhập đầy đủ User ID, Username và Password.")
      return
    }

    try {
      await signUpUsers([newUser])
      await loadUsers()
      toast.success("Thêm người dùng thành công!")

      setNewUser({
        userID: "",
        username: "",
        password: "",
        role: "STUDENT",
        fullName: "",
        email: "",
        phone: "",
        staff: undefined,
        student: {
          dateOfBirth: "",
          gender: "",
          classname: "",
        },
      })
    } catch (err: any) {
      toast.error(err.message || "Đăng ký người dùng thất bại.")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteUsers([id])
      setUsers(users.filter((u) => u.userID !== id))
      // Adjust current page if necessary
      const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
      if (currentPage > totalPages) {
        setCurrentPage(totalPages)
      }
      toast.success(`Đã xoá người dùng có ID: ${id}`)
    } catch (err: any) {
      toast.error(err.message || "Xoá người dùng thất bại.")
    }
  }

  const handleViewDetail = async (userID: string) => {
    try {
      const detail = await fetchUserDetail(userID)
      setSelectedUser(detail)
      setShowDetailDialog(true)
    } catch (err: any) {
      toast.error("Không thể tải chi tiết người dùng")
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.userID.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = filterRole === "All" || user.role === filterRole

    return matchesSearch && matchesRole
  })

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
  const startIndex = (currentPage - 1) * usersPerPage
  const endIndex = startIndex + usersPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <div className="p-6 w-full min-w-[80vw] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý tài khoản</h1>
        <Dialog>
          <DialogTrigger className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-900">
            + Thêm người dùng
          </DialogTrigger>
          <DialogContent className="max-w-2xl w-full">
            <DialogHeader>
              <DialogTitle>Thêm người dùng mới</DialogTitle>
              <DialogDescription>Nhập thông tin để tạo tài khoản người dùng mới.</DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <Input type="text" placeholder="User ID" value={newUser.userID} onChange={(e) => setNewUser({ ...newUser, userID: e.target.value })} />
              <Input type="text" placeholder="Username" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} />
              <Input type="password" placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
              <Input type="text" placeholder="Full Name" value={newUser.fullName} onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })} />
              <Input type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
              <Input type="text" placeholder="Phone" value={newUser.phone} onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} />

              <DropdownMenu>
                <DropdownMenuTrigger className="border px-2 py-1 rounded w-full text-left">{newUser.role}</DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Chọn vai trò</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setNewUser({ ...newUser, role: "STUDENT", staff: undefined, student: { dateOfBirth: "", gender: "", classname: "" } })}>STUDENT</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setNewUser({ ...newUser, role: "ADMIN", staff: undefined, student: undefined })}>ADMIN</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setNewUser({ ...newUser, role: "STAFF", staff: { position: "" }, student: undefined })}>STAFF</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {newUser.role === "STAFF" && (
                <Input type="text" placeholder="Position" value={newUser.staff?.position || ""} onChange={(e) => setNewUser({ ...newUser, staff: { position: e.target.value } })} />
              )}

              {newUser.role === "STUDENT" && (
                <>
                  <Input type="date" placeholder="Date of Birth" value={newUser.student?.dateOfBirth || ""} onChange={(e) => setNewUser({ ...newUser, student: { ...newUser.student!, dateOfBirth: e.target.value } })} />
                  <Input type="text" placeholder="Gender" value={newUser.student?.gender || ""} onChange={(e) => setNewUser({ ...newUser, student: { ...newUser.student!, gender: e.target.value } })} />
                  <Input type="text" placeholder="Classname" value={newUser.student?.classname || ""} onChange={(e) => setNewUser({ ...newUser, student: { ...newUser.student!, classname: e.target.value } })} />
                </>
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <button onClick={handleAddUser} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-900">
                Thêm người dùng
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Breadcrumb className="border-b border-gray-200 pb-2 mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/admin">Admin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <SlashIcon />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/admin/accounts">Accounts</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <input type="text" placeholder="Tìm kiếm (User ID hoặc Username)" className="border px-3 py-2 rounded w-full sm:w-72" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <DropdownMenu>
            <DropdownMenuTrigger className="border px-3 py-2 rounded w-full sm:w-auto text-left flex items-center justify-between gap-2">
              <span>{filterRole}</span>
              <ChevronsUpDownIcon className="w-4 h-4 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Phân loại theo vai trò</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilterRole("All")}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterRole("STUDENT")}>STUDENT</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterRole("ADMIN")}>ADMIN</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterRole("STAFF")}>STAFF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {loading ? (
        <div className="w-full border mb-8">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border px-4 py-2">User ID</th>
                <th className="border px-4 py-2">Username</th>
                <th className="border px-4 py-2">Role</th>
                <th className="border px-4 py-2">Position</th>
                <th className="border px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(4)].map((_, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2"><Skeleton className="h-[20px] w-[100px] rounded-full" /></td>
                  <td className="border px-4 py-2"><Skeleton className="h-[20px] w-[150px] rounded-full" /></td>
                  <td className="border px-4 py-2"><Skeleton className="h-[20px] w-[80px] rounded-full" /></td>
                  <td className="border px-4 py-2"><Skeleton className="h-[20px] w-[120px] rounded-full" /></td>
                  <td className="border px-4 py-2"><Skeleton className="h-[20px] w-[60px] rounded-full" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <table className="w-full border mb-8">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border px-4 py-2">User ID</th>
              <th className="border px-4 py-2">Username</th>
              <th className="border px-4 py-2">Role</th>
              <th className="border px-4 py-2">Position</th>
              <th className="border px-4 py-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user.userID}>
                <td className="border px-4 py-2">{user.userID}</td>
                <td className="border px-4 py-2">{user.username}</td>
                <td className="border px-4 py-2">{user.role}</td>
                <td className="border px-4 py-2">{user.staff?.position || "-"}</td>
                <td className="border px-4 py-2 flex gap-2">
                  <button onClick={() => handleViewDetail(user.userID)}>
                    <ViewIcon className="w-4 h-4 text-blue-500" />
                  </button>
                  <button onClick={() => handleDelete(user.userID)}>
                    <DeleteIcon className="w-4 h-4 text-red-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>Chi tiết người dùng</DialogTitle>
            <DialogDescription>Thông tin đầy đủ của tài khoản.</DialogDescription>
          </DialogHeader>

          {selectedUser ? (
            <div className="flex flex-col gap-2 mt-4">
              <p><strong>User ID:</strong> {selectedUser.userID}</p>
              <p><strong>Username:</strong> {selectedUser.username}</p>
              <p><strong>Full Name:</strong> {selectedUser.fullName}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Phone:</strong> {selectedUser.phone}</p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
              {selectedUser.role === "STAFF" && selectedUser.staff && (
                <p><strong>Position:</strong> {selectedUser.staff.position}</p>
              )}
              {selectedUser.role === "STUDENT" && selectedUser.student && (
                <>
                  <p><strong>Date of Birth:</strong> {selectedUser.student.dateOfBirth}</p>
                  <p><strong>Gender:</strong> {selectedUser.student.gender}</p>
                  <p><strong>Classname:</strong> {selectedUser.student.classname}</p>
                </>
              )}
            </div>
          ) : (
            <p>Đang tải...</p>
          )}
        </DialogContent>
      </Dialog>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              href="#" 
              onClick={() => handlePageChange(currentPage - 1)}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1
            return (
              <PaginationItem key={page}>
                <PaginationLink 
                  href="#"
                  onClick={() => handlePageChange(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          })}
          {totalPages > 5 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
          <PaginationItem>
            <PaginationNext 
              href="#" 
              onClick={() => handlePageChange(currentPage + 1)}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}