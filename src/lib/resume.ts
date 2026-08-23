import type { Bullet, BulletInput, Period, ResumeRecord } from "./types";

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

const MONTH = /^(\d{4})\.(\d{2})$/;

/** "2026.05"를 개월 수로. 형식이 어긋나면 null. */
function toMonths(value: string): number | null {
  const match = MONTH.exec(value);
  if (!match) return null;
  return Number(match[1]) * 12 + Number(match[2]);
}

/**
 * 실제 재직 기간의 합. 공백은 빼고 센다.
 * 재직 중인 곳은 기준 시점(이력서 최종 수정일)까지로 잡는다.
 * 시작 달과 끝 달을 모두 포함하는 한국식 경력 계산이다.
 */
export function totalMonths(records: readonly ResumeRecord[], asOf: string): number {
  const now = `${asOf.slice(0, 4)}.${asOf.slice(5, 7)}`;

  return records.reduce((sum, record) => {
    const from = toMonths(record.period.from);
    const to = toMonths(record.period.to ?? now) ?? toMonths(now);
    if (from === null || to === null || to < from) return sum;
    return sum + (to - from + 1);
  }, 0);
}

/** 81 → "6년 9개월" */
export function formatMonths(months: number): string {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (years === 0) return `${rest}개월`;
  if (rest === 0) return `${years}년`;
  return `${years}년 ${rest}개월`;
}
