export type BrewInput = {
  beanId: string | null;
  grinderId: string | null;
  dripperId: string | null;
  grindClicks: number | null;
  waterTempC: string | null;
  doseG: string | null;
  waterG: string | null;
  brewTimeSeconds: number | null;
  method: string | null;
  rating: number | null;
  isFavorite: boolean;
  tags: string[] | null;
  brewedAt: Date;
};

/** SCA cupping formu kategorileri (her biri 6-10, 0.25 adim). */
export const SCA_FIELDS = [
  { name: "scaFragrance", label: "Koku" },
  { name: "scaFlavor", label: "Tat" },
  { name: "scaAftertaste", label: "Bitiş" },
  { name: "scaAcidity", label: "Asitlik" },
  { name: "scaBody", label: "Gövde" },
  { name: "scaBalance", label: "Denge" },
  { name: "scaUniformity", label: "Tekdüzelik" },
  { name: "scaCleanCup", label: "Temiz fincan" },
  { name: "scaSweetness", label: "Tatlılık" },
  { name: "scaOverall", label: "Genel" },
] as const;

export type ScaField = (typeof SCA_FIELDS)[number]["name"];

export type TastingNoteInput = {
  aroma: string | null;
  flavor: string | null;
  acidity: string | null;
  body: string | null;
  sweetness: string | null;
  aftertaste: string | null;
} & Record<ScaField, string | null>;

/** SCA toplam puani: 10 kategorinin toplami (max 100). Eksik alan varsa null. */
export function scaTotal(note: Partial<Record<ScaField, string | null>>): number | null {
  const values = SCA_FIELDS.map(({ name }) => note[name]);
  if (values.some((v) => v === null || v === undefined || v === "")) return null;
  return values.reduce((sum, v) => sum + Number(v), 0);
}

export type ParseResult =
  | { ok: true; brew: BrewInput; note: TastingNoteInput; hasNote: boolean }
  | { ok: false; error: string };

function optional(value: FormDataEntryValue | null): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function optionalId(value: FormDataEntryValue | null): string | null {
  return typeof value === "string" && value ? value : null;
}

/** Bos -> null, sayi degilse veya araligin disindaysa hata. */
function numberInRange(
  value: FormDataEntryValue | null,
  { min, max, label }: { min: number; max: number; label: string },
): { ok: true; value: number | null } | { ok: false; error: string } {
  const raw = optional(value);
  if (raw === null) return { ok: true, value: null };

  const parsed = Number(raw.replace(",", "."));
  if (!Number.isFinite(parsed)) return { ok: false, error: `${label} sayı olmalı.` };
  if (parsed < min || parsed > max) {
    return { ok: false, error: `${label} ${min}-${max} aralığında olmalı.` };
  }
  return { ok: true, value: parsed };
}

/** Dakika + saniye alanlarini toplam saniyeye cevirir. */
export function toBrewSeconds(
  minutes: FormDataEntryValue | null,
  seconds: FormDataEntryValue | null,
): { ok: true; value: number | null } | { ok: false; error: string } {
  const min = numberInRange(minutes, { min: 0, max: 59, label: "Dakika" });
  if (!min.ok) return min;
  const sec = numberInRange(seconds, { min: 0, max: 59, label: "Saniye" });
  if (!sec.ok) return sec;

  if (min.value === null && sec.value === null) return { ok: true, value: null };
  return { ok: true, value: (min.value ?? 0) * 60 + (sec.value ?? 0) };
}

export function formatBrewTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes} dk ${String(seconds).padStart(2, "0")} sn`;
}

export function parseBrewForm(formData: FormData): ParseResult {
  const grindClicks = numberInRange(formData.get("grindClicks"), {
    min: 0,
    max: 999,
    label: "Öğütüm click",
  });
  if (!grindClicks.ok) return grindClicks;

  const waterTemp = numberInRange(formData.get("waterTempC"), {
    min: 1,
    max: 100,
    label: "Su sıcaklığı",
  });
  if (!waterTemp.ok) return waterTemp;

  const dose = numberInRange(formData.get("doseG"), { min: 0.1, max: 999, label: "Kahve" });
  if (!dose.ok) return dose;

  const water = numberInRange(formData.get("waterG"), { min: 1, max: 9999, label: "Su" });
  if (!water.ok) return water;

  const time = toBrewSeconds(formData.get("brewMinutes"), formData.get("brewSeconds"));
  if (!time.ok) return time;

  const rating = numberInRange(formData.get("rating"), { min: 1, max: 5, label: "Puan" });
  if (!rating.ok) return rating;
  if (rating.value !== null && !Number.isInteger(rating.value)) {
    return { ok: false, error: "Puan tam sayı olmalı." };
  }

  const brewedAtRaw = optional(formData.get("brewedAt"));
  const brewedAt = brewedAtRaw ? new Date(brewedAtRaw) : new Date();
  if (Number.isNaN(brewedAt.getTime())) {
    return { ok: false, error: "Demleme tarihi geçersiz." };
  }

  const note = {
    aroma: optional(formData.get("aroma")),
    flavor: optional(formData.get("flavor")),
    acidity: optional(formData.get("acidity")),
    body: optional(formData.get("body")),
    sweetness: optional(formData.get("sweetness")),
    aftertaste: optional(formData.get("aftertaste")),
  } as TastingNoteInput;

  for (const { name, label } of SCA_FIELDS) {
    const parsed = numberInRange(formData.get(name), { min: 6, max: 10, label: `SCA ${label}` });
    if (!parsed.ok) return parsed;
    note[name] = parsed.value === null ? null : String(parsed.value);
  }

  return {
    ok: true,
    brew: {
      beanId: optionalId(formData.get("beanId")),
      grinderId: optionalId(formData.get("grinderId")),
      dripperId: optionalId(formData.get("dripperId")),
      grindClicks: grindClicks.value,
      // numeric kolonlar Drizzle'da string bekler.
      waterTempC: waterTemp.value === null ? null : String(waterTemp.value),
      doseG: dose.value === null ? null : String(dose.value),
      waterG: water.value === null ? null : String(water.value),
      brewTimeSeconds: time.value,
      method: optional(formData.get("method")),
      rating: rating.value,
      isFavorite: formData.get("isFavorite") === "on",
      tags: parseTags(formData.get("tags")),
      brewedAt,
    },
    note,
    hasNote: Object.values(note).some((field) => field !== null),
  };
}

/** "sabah, deneme , sabah" -> ["sabah", "deneme"] (kirpilmis, tekrarsiz, kucuk harf). */
export function parseTags(raw: FormDataEntryValue | null): string[] | null {
  if (typeof raw !== "string" || !raw.trim()) return null;
  const tags = [
    ...new Set(
      raw
        .split(",")
        .map((tag) => tag.trim().toLocaleLowerCase("tr"))
        .filter(Boolean),
    ),
  ];
  return tags.length ? tags.slice(0, 12) : null;
}

/** Kahve:su oranini "1:16" biciminde verir. */
export function brewRatio(doseG: string | null, waterG: string | null): string | null {
  if (!doseG || !waterG) return null;
  const dose = Number(doseG);
  const water = Number(waterG);
  if (!dose || !water) return null;
  return `1:${(water / dose).toFixed(1)}`;
}
