import assert from "node:assert/strict";
import test from "node:test";
import { brewRatio, formatBrewTime, parseBrewForm, toBrewSeconds } from "./brews";

function form(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) fd.set(key, value);
  return fd;
}

test("dakika+saniye toplam saniyeye cevrilir", () => {
  assert.deepEqual(toBrewSeconds("2", "35"), { ok: true, value: 155 });
  assert.deepEqual(toBrewSeconds("3", ""), { ok: true, value: 180 });
  assert.deepEqual(toBrewSeconds("", "45"), { ok: true, value: 45 });
  assert.deepEqual(toBrewSeconds("", ""), { ok: true, value: null });
});

test("60 ve uzeri saniye reddedilir", () => {
  assert.equal(toBrewSeconds("2", "60").ok, false);
  assert.equal(toBrewSeconds("2", "-1").ok, false);
});

test("sure okunabilir bicimde yazilir", () => {
  assert.equal(formatBrewTime(155), "2 dk 35 sn");
  assert.equal(formatBrewTime(180), "3 dk 00 sn");
  assert.equal(formatBrewTime(45), "0 dk 45 sn");
});

test("tam demleme formu ayristirilir", () => {
  const result = parseBrewForm(
    form({
      grindClicks: "88",
      waterTempC: "92,5",
      doseG: "15",
      waterG: "250",
      brewMinutes: "2",
      brewSeconds: "35",
      method: "V60",
      rating: "4",
      brewedAt: "2026-07-21T08:30",
      flavor: "Limonata gibi mayhoş",
    }),
  );
  assert.equal(result.ok, true);
  if (!result.ok) return;

  assert.equal(result.brew.grindClicks, 88);
  // Virgullu ondalik nokta olarak okunmali.
  assert.equal(result.brew.waterTempC, "92.5");
  assert.equal(result.brew.brewTimeSeconds, 155);
  assert.equal(result.brew.rating, 4);
  assert.equal(result.note.flavor, "Limonata gibi mayhoş");
  assert.equal(result.hasNote, true);
});

test("bos form kabul edilir, tadim notu bos sayilir", () => {
  const result = parseBrewForm(form({}));
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.hasNote, false);
  assert.equal(result.brew.grindClicks, null);
});

test("arali disi degerler reddedilir", () => {
  assert.equal(parseBrewForm(form({ waterTempC: "150" })).ok, false);
  assert.equal(parseBrewForm(form({ rating: "6" })).ok, false);
  assert.equal(parseBrewForm(form({ rating: "3.5" })).ok, false);
  assert.equal(parseBrewForm(form({ grindClicks: "abc" })).ok, false);
});

test("oran hesaplanir", () => {
  assert.equal(brewRatio("15", "250"), "1:16.7");
  assert.equal(brewRatio(null, "250"), null);
  assert.equal(brewRatio("0", "250"), null);
});
