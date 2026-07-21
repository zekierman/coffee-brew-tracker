import assert from "node:assert/strict";
import test from "node:test";
import { brewsPerMonth, summarize, topRatedBrews, type BrewRow } from "./stats";

let counter = 0;
function row(over: Partial<BrewRow> = {}): BrewRow {
  return {
    id: `brew-${counter++}`,
    grindClicks: null,
    rating: null,
    method: null,
    waterTempC: null,
    doseG: null,
    waterG: null,
    brewTimeSeconds: null,
    brewedAt: new Date("2026-07-21T09:00:00Z"),
    beanName: null,
    ...over,
  };
}

test("en yuksek puanli demleme basa gelir", () => {
  const result = topRatedBrews([
    row({ id: "orta", rating: 3 }),
    row({ id: "en-iyi", rating: 5 }),
    row({ id: "iyi", rating: 4 }),
  ]);

  assert.deepEqual(
    result.map((r) => r.id),
    ["en-iyi", "iyi", "orta"],
  );
});

test("esit puanda yeni tarihli ustte kalir", () => {
  const result = topRatedBrews([
    row({ id: "eski", rating: 5, brewedAt: new Date("2026-07-01") }),
    row({ id: "yeni", rating: 5, brewedAt: new Date("2026-07-20") }),
  ]);

  assert.deepEqual(
    result.map((r) => r.id),
    ["yeni", "eski"],
  );
});

test("puansiz demleme listeye girmez", () => {
  const result = topRatedBrews([row({ rating: null }), row({ id: "puanli", rating: 2 })]);
  assert.deepEqual(
    result.map((r) => r.id),
    ["puanli"],
  );
});

test("liste limitle kirpilir", () => {
  const many = Array.from({ length: 12 }, () => row({ rating: 4 }));
  assert.equal(topRatedBrews(many, 5).length, 5);
});

test("aylik demleme sayisi bos aylari 0 ile doldurur", () => {
  const now = new Date(2026, 6, 21); // Temmuz 2026
  const result = brewsPerMonth([row({ brewedAt: new Date(2026, 6, 2) })], 3, now);

  assert.equal(result.length, 3);
  assert.equal(result[0].value, 0); // Mayis
  assert.equal(result[1].value, 0); // Haziran
  assert.equal(result[2].value, 1); // Temmuz
});

test("ozet: ortalama puan, oran ve toplam kahve", () => {
  const summary = summarize(
    [
      row({ rating: 4, doseG: "15", waterG: "250" }),
      row({ rating: 5, doseG: "15", waterG: "240" }),
      row({ rating: null, doseG: "20", waterG: null }),
    ],
    1,
  );

  assert.equal(summary.total, 3);
  assert.equal(summary.rated, 2);
  assert.equal(summary.averageRating, 4.5);
  assert.equal(summary.favorites, 1);
  assert.equal(summary.averageRatio, 16.3); // (250/15 + 240/15) / 2 = 16.33
  assert.equal(summary.totalCoffeeG, 50);
});

test("bos veri cokmez", () => {
  const summary = summarize([], 0);
  assert.equal(summary.total, 0);
  assert.equal(summary.averageRating, null);
  assert.equal(summary.averageRatio, null);
  assert.deepEqual(topRatedBrews([]), []);
});
