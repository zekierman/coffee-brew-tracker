/** RFC 4180: tirnak ikilenir; ayirici, tirnak veya yeni satir iceren alan tirnaklanir. */
export function csvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const text = value instanceof Date ? value.toISOString() : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => csvCell(row[h])).join(",")),
  ];
  // BOM: Excel UTF-8'i boyle dogru okuyor, yoksa Turkce karakterler bozuluyor.
  return `﻿${lines.join("\r\n")}`;
}
