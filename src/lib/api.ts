// lib/api.ts
export async function login(username: string, password: string) {
  const res = await fetch("http://localhost:8080/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json();
}
export async function forgotPassword(email: string) {
  const res = await fetch("http://localhost:8080/user/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    throw new Error("Forgot password request failed");
  }

  return res.json();
}
export async function resetPasswordWithCode(
  code: string,
  newPassword: string,
  confirmPassword: string
) {
  const res = await fetch("http://localhost:8080/user/reset-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code, newPassword, confirmPassword }),
  });

  if (!res.ok) {
    throw new Error("Reset password failed");
  }

  return res.json();
}

