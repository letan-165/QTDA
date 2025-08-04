"use client"

import { useEffect, useState } from "react"
import { fetchAllUsers, signUpUsers, NewUser, UserResponse, deleteUsers } from "@/lib/api"
import { toast } from "sonner"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SlashIcon, DeleteIcon, ChevronsUpDownIcon } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function UserPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRole, setFilterRole] = useState("All")  
  const [users, setUsers] = useState<UserResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [newUser, setNewUser] = useState<NewUser>({
    userID: "",
    username: "",
    password: "",
    role: "STUDENT",
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await fetchAllUsers()
      setUsers(data)
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
        staff: undefined,
      })
    } catch (err: any) {
      toast.error(err.message || "Đăng ký người dùng thất bại.")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteUsers([id])
      setUsers(users.filter((u) => u.userID !== id))
      toast.success(`Đã xoá người dùng có ID: ${id}`)
    } catch (err: any) {
      toast.error(err.message || "Xoá người dùng thất bại.")
    }
  }

  const filteredUsers = users.filter((user) => {
  const matchesSearch =
    user.userID.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())

  const matchesRole = filterRole === "All" || user.role === filterRole

  return matchesSearch && matchesRole
})


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
              <DialogDescription>
                Nhập thông tin để tạo tài khoản người dùng mới.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
              <Input
                type="text"
                placeholder="User ID"
                className="border px-2 py-1"
                value={newUser.userID}
                onChange={(e) => setNewUser({ ...newUser, userID: e.target.value })}
              />
              <Input
                type="text"
                placeholder="Username"
                className="border px-2 py-1"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              />
              <Input
                type="password"
                placeholder="Password"
                className="border px-2 py-1"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
                <DropdownMenu>
                  <DropdownMenuTrigger className="border px-2 py-1 rounded w-full text-left">
                    {newUser.role}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Chọn vai trò</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() =>
                        setNewUser({ ...newUser, role: "STUDENT", staff: undefined })
                      }
                    >
                      STUDENT
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        setNewUser({ ...newUser, role: "ADMIN", staff: undefined })
                      }
                    >
                      ADMIN
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        setNewUser({
                          ...newUser,
                          role: "STAFF",
                          staff: { position: newUser.staff?.position || "" },
                        })
                      }
                    >
                      STAFF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

              {newUser.role === "STAFF" && (
                <Input
                  type="text"
                  placeholder="Position"
                  className="border px-2 py-1"
                  value={newUser.staff?.position || ""}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      staff: { position: e.target.value },
                    })
                  }
                />
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleAddUser}
                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-900"
              >
                Thêm người dùng
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Breadcrumb */}
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
          {/* Search */}
          <input
            type="text"
            placeholder="Tìm kiếm (User ID hoặc Username)"
            className="border px-3 py-2 rounded w-full sm:w-72"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Dropdown */}
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
        <p>Đang tải...</p>
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
            {filteredUsers.map((user) => (
              <tr key={user.userID}>
                <td className="border px-4 py-2">{user.userID}</td>
                <td className="border px-4 py-2">{user.username}</td>
                <td className="border px-4 py-2">{user.role}</td>
                <td className="border px-4 py-2">{user.staff?.position || "-"}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleDelete(user.userID)}
   
                  >
                    <DeleteIcon className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}