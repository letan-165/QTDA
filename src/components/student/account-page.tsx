"use client"

import { useEffect, useState } from "react"
import { 
  fetchStudentRegistrationsCount, 
  fetchStudentFullName, 
  fetchStudentSupportRequests, 
  countNotifications,
  fetchUpcomingEvents,
  fetchRecentActivities
} from "@/lib/api/studentApi"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Headphones, Bell, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

export function DashboardStudent() {
  const [scholarshipCount, setScholarshipCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [fullName, setFullName] = useState("")
  const [requestCount, setRequestCount] = useState(0)
  const [notificationsCount, setNotificationsCount] = useState(0)
  const [recentActivities, setRecentActivities] = useState<any[]>([]) 
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([])


  useEffect(() => {
    loadData()
  }, [])

      const loadData = async () => {
      const [
        scholarshipCount,
        fullName,
        requestCount,
        notificationsCount,
        activities,
        events 
      ] = await Promise.all([
        fetchStudentRegistrationsCount(),
        fetchStudentFullName(),
        fetchStudentSupportRequests(),
        countNotifications(),
        fetchRecentActivities(),
        fetchUpcomingEvents()
      ])

      setScholarshipCount(scholarshipCount)
      setRequestCount(requestCount) 
      setFullName(fullName)
      setNotificationsCount(notificationsCount)
      setRecentActivities(activities)
      setUpcomingEvents(events) 
      setLoading(false)
    }

  const stats = [
    { 
      title: "Học bổng đã đăng ký", 
      value: loading ? "..." : scholarshipCount, 
      icon: <GraduationCap className="w-6 h-6 text-blue-500" /> 
    },
    { 
      title: "Yêu cầu hỗ trợ", 
      value: loading ? "..." : requestCount,
      icon: <Headphones className="w-6 h-6 text-green-500" /> 
    },
    { 
      title: "Thông báo mới", 
      value: loading ? "..." : notificationsCount,
      icon: <Bell className="w-6 h-6 text-orange-500" /> 
    },
  ]

  return (
    <div className="p-6 w-full min-w-[80vw] mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Xin chào, {fullName || "..."}</h1>
        <Breadcrumb className="border-b border-gray-200 pb-2">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/student">Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((item, index) => (
          <Card key={index} className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-gray-500">{item.title}</p>
              <p className="text-2xl font-bold">{item.value}</p>
            </div>
            {item.icon}
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col flex-1 space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentActivities.length === 0 ? (
              <p className="text-gray-500 text-sm">Không có hoạt động nào gần đây</p>
            ) : (
              <ScrollArea className="flex-1 pr-4 max-h-64">
                <div className="space-y-4">
                  {recentActivities.map((act, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      {act.icon}
                      <div>
                        <p className="font-medium">{act.title}</p>
                        <p className="text-sm text-gray-500">{act.desc}</p>
                        <span className="text-xs text-gray-400">{act.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}

          </CardContent>
        </Card>

        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>Sự kiện sắp diễn ra</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col flex-1 space-y-4">
            <div className="flex-1 space-y-4">
              {loading ? (
                [...Array(4)].map((_, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-36" />
                    </div>
                  </div>
                ))
              ) : upcomingEvents.length === 0 ? (
                <p className="text-gray-500 text-sm">Không có sự kiện nào sắp diễn ra</p>
              ) : (
                upcomingEvents.map((ev, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{ev.title}</p>
                      <p className="text-sm text-gray-500">
                        {ev.date} - {ev.time} | {ev.location}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-r bg-gray-700 text-white">
          <CardHeader>
            <CardTitle>Học bổng mới</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Bạn là sinh viên cuối tháng, đăng ký ngay</p>
            <Link rel="stylesheet" href="/dashboard/student/scholarships" >
            <Button variant="secondary" className="mt-4">Đăng ký ngay</Button>
          </Link>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r bg-gray-700 text-white">
          <CardHeader>
            <CardTitle>Hỗ trợ sinh viên</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Cần hỗ trợ? Gửi yêu cầu và nhận phản hồi trong 24h</p>
            <Link rel="stylesheet" href="/dashboard/student/supports/request" >
            <Button variant="secondary" className="mt-4">Gửi yêu cầu</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
