export type BeanInput = {
  name: string;
  country: string | null;
  region: string | null;
  farm: string | null;
  variety: string | null;
  processMethod: string | null;
  roastDate: string | null;
  roaster: string | null;
  notes: string | null;
  stockG: string | null;
};

/** Stok bu gramin altina dusunce uyarilir (yaklasik 3 demleme). */
export const LOW_STOCK_G = 50;

export type ParseResult = { ok: true; value: BeanInput } | { ok: false; error: string };

function optional(value: FormDataEntryValue | null): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function parseBeanForm(formData: FormData): ParseResult {
  const name = formData.get("name");
  if (typeof name !== "string" || !name.trim()) {
    return { ok: false, error: "Çekirdek adı zorunlu." };
  }
  if (name.trim().length > 160) {
    return { ok: false, error: "Çekirdek adı çok uzun." };
  }

  const roastDate = optional(formData.get("roastDate"));
  if (roastDate && !/^\d{4}-\d{2}-\d{2}$/.test(roastDate)) {
    return { ok: false, error: "Kavurma tarihi geçersiz." };
  }

  const rawStock = optional(formData.get("stockG"));
  let stockG: string | null = null;
  if (rawStock !== null) {
    const parsed = Number(rawStock.replace(",", "."));
    if (!Number.isFinite(parsed) || parsed < 0 || parsed > 99999) {
      return { ok: false, error: "Stok 0-99999 g aralığında olmalı." };
    }
    stockG = String(parsed);
  }

  return {
    ok: true,
    value: {
      name: name.trim(),
      country: optional(formData.get("country")),
      region: optional(formData.get("region")),
      farm: optional(formData.get("farm")),
      variety: optional(formData.get("variety")),
      processMethod: optional(formData.get("processMethod")),
      roastDate,
      roaster: optional(formData.get("roaster")),
      notes: optional(formData.get("notes")),
      stockG,
    },
  };
}

// Kavurma tarihinden bu yana gecen gun ("rest" suresi demlemede onemli).
export function daysSinceRoast(roastDate: string, today = new Date()): number {
  const roast = new Date(`${roastDate}T00:00:00Z`);
  const now = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()),
  );
  return Math.round((now.getTime() - roast.getTime()) / 86_400_000);
}
