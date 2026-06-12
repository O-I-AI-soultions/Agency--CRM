import { createHmac, timingSafeEqual } from "crypto";

export const SESSION_COOKIE_NAME = "oi_dashboard_session";
const SESSION_VALUE = "authenticated";

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("Missing AUTH_SECRET env var");
  return secret;
}

export function createSessionToken(): string {
  const secret = getSecret();
  const mac = createHmac("sha256", secret).update(SESSION_VALUE).digest("hex");
  return `${SESSION_VALUE}.${mac}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const secret = getSecret();
  const [value, mac] = token.split(".");
  if (!value || !mac || value !== SESSION_VALUE) return false;
  const expected = createHmac("sha256", secret).update(value).digest("hex");
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
