import assert from "node:assert/strict";
import test from "node:test";
import { csvCell, toCsv } from "./csv";

test("duz degerler tirnaklanmaz", () => {
  assert.equal(csvCell("V60"), "V60");
  assert.equal(csvCell(88), "88");
  assert.equal(csvCell(null), "");
  assert.equal(csvCell(undefined), "");
});

test("ayirici, tirnak ve yeni satir iceren alanlar tirnaklanir", () => {
  assert.equal(csvCell("Limonata, mayhos"), '"Limonata, mayhos"');
  assert.equal(csvCell('bitter "kakao"'), '"bitter ""kakao"""');
  assert.equal(csvCell("iki\nsatir"), '"iki\nsatir"');
});

test("tarih ISO olarak yazilir", () => {
  assert.equal(csvCell(new Date("2026-07-21T09:00:00Z")), "2026-07-21T09:00:00.000Z");
});

test("satirlar basliklarla ve CRLF ile birlesir", () => {
  const csv = toCsv([
    { yontem: "V60", puan: 4 },
    { yontem: "Chemex, test", puan: 5 },
  ]);

  const lines = csv.replace("﻿", "").split("\r\n");
  assert.deepEqual(lines, ["yontem,puan", "V60,4", '"Chemex, test",5']);
});

test("BOM eklenir (Excel Turkce karakterleri bozmasin)", () => {
  assert.equal(toCsv([{ a: 1 }]).charCodeAt(0), 0xfeff);
});

test("bos veri bos metin verir", () => {
  assert.equal(toCsv([]), "");
});
