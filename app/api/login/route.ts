import { cookies } from "next/headers";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  const { password } = (await request.json()) as { password?: string };

  if (!password || password !== process.env.DASHBOARD_PASSWORD) {
    return Response.json({ error: "סיסמה שגויה" }, { status: 401 });
  }

  const token = createSessionToken();
  (await cookies()).set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return Response.json({ ok: true });
}
