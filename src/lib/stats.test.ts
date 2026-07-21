import assert from "node:assert/strict";
import test from "node:test";
import { brewsPerMonth, ratingByBean, ratingByGrind, summarize, type BrewRow } from "./stats";

function row(over: Partial<BrewRow> = {}): BrewRow {
  return {
    grindClicks: null,
    rating: null,
    method: null,
    doseG: null,
    waterG: null,
    brewedAt: new Date("2026-07-21T09:00:00Z"),
    beanName: null,
    ...over,
  };
}

test("ogutum tikina gore ortalama puan, tik sirasinda gelir", () => {
  const result = ratingByGrind([
    row({ grindClicks: 92, rating: 3 }),
    row({ grindClicks: 88, rating: 4 }),
    row({ grindClicks: 88, rating: 5 }),
  ]);

  assert.deepEqual(result, [
    { label: "88", value: 4.5, count: 2 },
    { label: "92", value: 3, count: 1 },
  ]);
});

test("puansiz demleme ortalamaya girmez", () => {
  const result = ratingByGrind([
    row({ grindClicks: 88, rating: 4 }),
    row({ grindClicks: 88, rating: null }),
  ]);
  assert.deepEqual(result, [{ label: "88", value: 4, count: 1 }]);
});

test("tiksiz demleme gruplanmaz", () => {
  assert.deepEqual(ratingByGrind([row({ grindClicks: null, rating: 5 })]), []);
});

test("cekirdek ortalamalari puana gore siralanir", () => {
  const result = ratingByBean([
    row({ beanName: "Kenya", rating: 3 }),
    row({ beanName: "Etiyopya", rating: 5 }),
  ]);
  assert.equal(result[0].label, "Etiyopya");
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
  assert.deepEqual(ratingByGrind([]), []);
});
