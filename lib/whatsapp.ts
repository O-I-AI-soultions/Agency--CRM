export function toWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) return "972" + digits.slice(1);
  return digits;
}

export function buildWhatsAppMessage(partnerName: string): string {
  return encodeURIComponent(
    `שלום, אני ${partnerName} מסוכנות O-I. ראיתי את העסק שלכם וחשבתי שנוכל לעזור לכם להגדיל את הנוכחות הדיגיטלית שלכם. האם תהיו פנויים לשיחה קצרה?`
  );
}
