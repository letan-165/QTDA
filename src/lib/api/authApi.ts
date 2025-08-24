import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import {API_BASE} from "./index"



type DecodedToken = {
  sub: string;
  scope: "ADMIN" | "STUDENT" | "STAFF";
  exp: number; 
};

export function handleLogin(accessToken: string, router: AppRouterInstance) {
  let decoded: DecodedToken;

  try {
    decoded = jwtDecode<DecodedToken>(accessToken);
  } catch {
    throw new Error("Token không hợp lệ");
  }

  const role = decoded.scope;
  const userId = decoded.sub;


  Cookies.set("access_token", accessToken, {
    secure: true,
    sameSite: "Strict",
  });

  Cookies.set("userId", userId, {
    secure: true,
    sameSite: "Strict",
  });

  {/*
  if (Date.now() >= expiresDate.getTime()) {
    Cookies.remove("access_token");
    Cookies.remove("userId");
    router.push("/auth/login");
    return;
  }
    */}

  switch (role) {
    case "ADMIN":
      router.push("/dashboard/admin/accounts");
      break;
    case "STUDENT":
      router.push("/dashboard/student");
      break;
    case "STAFF":
      router.push("/dashboard/staff/notifications");
      break;
    default:
      router.push("/dashboard");
  }
}

export async function loginApi(
  username: string,
  password: string,
  router: AppRouterInstance
): Promise<void> {
  const res = await fetch(`${API_BASE}/api/auth/public/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error("Sai tên đăng nhập hoặc mật khẩu!");
  }

  const data = await res.json();
  const token = data.result;
  handleLogin(token, router);
}

export async function sendResetPasswordApi(data: {
  username: string
  email: string
  password: string
  otp: number
}): Promise<void> {
  const res = await fetch(`${API_BASE}/api/auth/public/forgot`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || "Đặt lại mật khẩu thất bại")
  }
}

export async function sendOTP(
  email: string
): Promise<void> {
  const res = await fetch(`${API_BASE}api/otp/public`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email}),
  });

  if (!res.ok) {
    throw new Error("Đặt lại mật khẩu thất bại!");
  }
}
