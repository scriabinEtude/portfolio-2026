import type { Bullet, BulletInput, Period } from "./types";

/** 내용을 쓸 때는 문자열로, 그릴 때는 항상 같은 모양으로 다룬다. */
export function toBullet(input: BulletInput): Bullet {
  return typeof input === "string" ? { text: input } : input;
}

/** 2026.05 ~ 재직 중 → "2026.05 — 재직 중" */
export function formatPeriod(period: Period): string {
  return period.to ? `${period.from} — ${period.to}` : period.from;
}

/** 기술 목록은 가운뎃점으로 잇는다. */
export function joinValues(values: readonly string[]): string {
  return values.join(" · ");
}
