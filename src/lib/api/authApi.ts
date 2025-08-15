import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

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

  const expiresDate = new Date(decoded.exp * 1000);

  Cookies.set("access_token", accessToken, {
    expires: expiresDate,
    secure: true,
    sameSite: "Strict",
  });

  Cookies.set("userId", userId, {
    expires: expiresDate,
    secure: true,
    sameSite: "Strict",
  });

  if (Date.now() >= expiresDate.getTime()) {
    Cookies.remove("access_token");
    Cookies.remove("userId");
    router.push("/auth/login");
    return;
  }

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

export async function loginApi(username: string,password: string,router: AppRouterInstance): Promise<void> {
  const res = await fetch("http://localhost:8080/api/auth/public/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    let errMsg = "Đăng nhập thất bại";
    try {
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const errData = await res.json();
        if (errData.error) errMsg = errData.error;
      } else {
        errMsg = await res.text();
      }
    } catch {
    }
    throw new Error(errMsg);
  }

  const data = await res.json();
  const token = data.result;
  handleLogin(token, router);
}
