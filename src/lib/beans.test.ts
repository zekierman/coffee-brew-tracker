import assert from "node:assert/strict";
import test from "node:test";
import { daysSinceRoast, parseBeanForm } from "./beans";

function form(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) fd.set(key, value);
  return fd;
}

test("kunye alanlari ayristirilir", () => {
  const result = parseBeanForm(
    form({
      name: " Etiyopya Yirgacheffe ",
      country: "Etiyopya",
      region: "Yirgacheffe",
      farm: "",
      variety: "Heirloom",
      processMethod: "Yıkanmış",
      roastDate: "2026-07-01",
      roaster: "Coffee Sapiens",
    }),
  );
  assert.equal(result.ok, true);
  if (!result.ok) return;

  assert.equal(result.value.name, "Etiyopya Yirgacheffe");
  assert.equal(result.value.farm, null);
  assert.equal(result.value.roastDate, "2026-07-01");
});

test("adsiz kunye reddedilir", () => {
  assert.equal(parseBeanForm(form({ name: "  " })).ok, false);
});

test("bozuk kavurma tarihi reddedilir", () => {
  assert.equal(parseBeanForm(form({ name: "X", roastDate: "01.07.2026" })).ok, false);
});

test("kavurmadan bu yana gecen gun hesaplanir", () => {
  assert.equal(daysSinceRoast("2026-07-01", new Date("2026-07-21T15:00:00Z")), 20);
  assert.equal(daysSinceRoast("2026-07-21", new Date("2026-07-21T15:00:00Z")), 0);
});
