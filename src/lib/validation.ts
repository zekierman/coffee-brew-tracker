export type ValidationResult = { ok: true; email: string } | { ok: false; error: string };

// ponytail: elle yazilmis minimal dogrulama, zod eklemeye deger degil.
// Alan sayisi artip kurallar karmasiklasirsa zod'a gecilebilir.
export function validateCredentials(email: unknown, password: unknown): ValidationResult {
  if (typeof email !== "string" || typeof password !== "string") {
    return { ok: false, error: "Geçersiz form verisi." };
  }

  const normalized = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return { ok: false, error: "Geçerli bir e-posta adresi girin." };
  }
  if (password.length < 8) {
    return { ok: false, error: "Şifre en az 8 karakter olmalı." };
  }

  return { ok: true, email: normalized };
}
