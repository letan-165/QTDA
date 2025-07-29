import { jwtDecode } from 'jwt-decode';

export type UserRole = "ADMIN" | "STUDENT" | "STUDENT_AFFAIRS" | "MENTOR";

interface JwtPayload {
  role: UserRole;
  [key: string]: any;
}

export async function getUserRole(): Promise<UserRole> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (!decoded.role) throw new Error("Role not found in token");
    return decoded.role;
  } catch (err) {
    throw new Error("Invalid token or decoding error");
  }
}
