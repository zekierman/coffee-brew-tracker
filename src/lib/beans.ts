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
};

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
