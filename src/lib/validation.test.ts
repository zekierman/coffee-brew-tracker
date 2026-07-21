import assert from "node:assert/strict";
import test from "node:test";
import { validateCredentials } from "./validation";

test("gecerli girdiyi normalize eder", () => {
  const result = validateCredentials("  Zeki@Example.COM ", "cokgizli123");
  assert.deepEqual(result, { ok: true, email: "zeki@example.com" });
});

test("bozuk e-postayi reddeder", () => {
  for (const bad of ["", "zeki", "zeki@", "@example.com", "zeki example@x.com"]) {
    assert.equal(validateCredentials(bad, "cokgizli123").ok, false, `kabul edildi: ${bad}`);
  }
});

test("kisa sifreyi reddeder", () => {
  assert.equal(validateCredentials("zeki@example.com", "kisa").ok, false);
});

test("string olmayan girdiyi reddeder", () => {
  assert.equal(validateCredentials(null, "cokgizli123").ok, false);
  assert.equal(validateCredentials("zeki@example.com", undefined).ok, false);
});
