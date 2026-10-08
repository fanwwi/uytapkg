import crypto from "crypto";

// Криптографически стойкий 6-значный код (никакого Math.random()).
export function generateSecureOtp() {
  return crypto.randomInt(100000, 1000000).toString();
}

// Сравнение строк, устойчивое к атакам по времени.
export function safeCompare(a, b) {
  const bufA = Buffer.from(String(a ?? ""), "utf8");
  const bufB = Buffer.from(String(b ?? ""), "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}
