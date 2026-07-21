import assert from "node:assert/strict";
import test from "node:test";
import { parseEquipmentForm } from "./equipment";

function form(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) fd.set(key, value);
  return fd;
}

test("gecerli formu ayristirir ve trim eder", () => {
  const result = parseEquipmentForm(
    form({ type: "grinder", name: "  Kingrinder K6 ", brand: " Kingrinder ", notes: "" }),
  );
  assert.deepEqual(result, {
    ok: true,
    value: { type: "grinder", name: "Kingrinder K6", brand: "Kingrinder", notes: null },
  });
});

test("bilinmeyen tipi reddeder", () => {
  assert.equal(parseEquipmentForm(form({ type: "espresso", name: "X" })).ok, false);
});

test("bos adi reddeder", () => {
  assert.equal(parseEquipmentForm(form({ type: "dripper", name: "   " })).ok, false);
});

test("cok uzun adi reddeder", () => {
  assert.equal(parseEquipmentForm(form({ type: "dripper", name: "a".repeat(121) })).ok, false);
});
