import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

type DecodedToken = {
  sub: string; 
  scope: "ADMIN" | "STUDENT" | "STAFF";
  exp: number;
};

export function handleLogin(accessToken: string) {
  const decoded: DecodedToken = jwtDecode(accessToken);
  const role = decoded.scope;
  const userId = decoded.sub;

  const expiresInDays =
    (decoded.exp * 1000 - Date.now()) / (1000 * 60 * 60 * 24);

  Cookies.set("access_token", accessToken, {
    expires: expiresInDays,
    secure: true,
    sameSite: "Strict",
  });

  Cookies.set("userId", userId, {
    expires: expiresInDays,
    secure: true,
    sameSite: "Strict",
  });

  switch (role) {
    case "ADMIN":
      window.location.href = "/dashboard/admin/accounts";
      break;
    case "STUDENT":
      window.location.href = "/dashboard/student";
      break;
    case "STAFF":
      window.location.href = "/dashboard/staff";
      break;
    default:
      window.location.href = "/dashboard";
  }
}
