export const EQUIPMENT_TYPES = [
  "grinder",
  "dripper",
  "kettle",
  "scale",
  "filter",
  "other",
] as const;

export type EquipmentType = (typeof EQUIPMENT_TYPES)[number];

export const EQUIPMENT_TYPE_LABELS: Record<EquipmentType, string> = {
  grinder: "Değirmen",
  dripper: "Dripper",
  kettle: "Kettle",
  scale: "Terazi",
  filter: "Filtre",
  other: "Diğer",
};

export type EquipmentInput = {
  type: EquipmentType;
  name: string;
  brand: string | null;
  notes: string | null;
};

export type ParseResult = { ok: true; value: EquipmentInput } | { ok: false; error: string };

function optional(value: FormDataEntryValue | null): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function parseEquipmentForm(formData: FormData): ParseResult {
  const type = formData.get("type");
  if (typeof type !== "string" || !EQUIPMENT_TYPES.includes(type as EquipmentType)) {
    return { ok: false, error: "Geçersiz ekipman tipi." };
  }

  const name = formData.get("name");
  if (typeof name !== "string" || !name.trim()) {
    return { ok: false, error: "Ekipman adı zorunlu." };
  }
  if (name.trim().length > 120) {
    return { ok: false, error: "Ekipman adı çok uzun." };
  }

  return {
    ok: true,
    value: {
      type: type as EquipmentType,
      name: name.trim(),
      brand: optional(formData.get("brand")),
      notes: optional(formData.get("notes")),
    },
  };
}
