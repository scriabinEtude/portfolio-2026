import { load } from "js-yaml";

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*\r?\n?/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

export type ParsedFile = {
  readonly data: Record<string, unknown>;
  readonly body: string;
};

/**
 * `--- ... ---` 블록을 잘라내 YAML로 읽고 나머지를 본문으로 돌려준다.
 * 형식이 어긋나면 어느 파일인지 짚어서 즉시 실패한다.
 */
export function parseFrontmatter(raw: string, source: string): ParsedFile {
  const match = FRONTMATTER.exec(raw);
  if (!match) {
    throw new Error(`${source}: 파일 첫 줄부터 --- 로 감싼 frontmatter가 필요합니다.`);
  }

  const data = load(match[1]);
  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    throw new Error(`${source}: frontmatter는 "키: 값" 목록이어야 합니다.`);
  }

  return {
    data: data as Record<string, unknown>,
    body: raw.slice(match[0].length).trim(),
  };
}

export function readString(data: ParsedFile["data"], key: string, source: string): string {
  const value = data[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${source}: frontmatter에 문자열 "${key}"가 필요합니다.`);
  }
  return value.trim();
}

export function readDate(data: ParsedFile["data"], key: string, source: string): string {
  // js-yaml은 따옴표 없는 2026-03-12를 Date로 바꾸므로 원본 문자열을 강제한다.
  const value = data[key];
  if (value instanceof Date) {
    throw new Error(`${source}: "${key}"를 따옴표로 감싸세요. 예) ${key}: "2026-03-12"`);
  }
  const text = readString(data, key, source);
  if (!DATE.test(text)) {
    throw new Error(`${source}: "${key}"는 YYYY-MM-DD 형식이어야 합니다. (받은 값: ${text})`);
  }
  return text;
}

export function readStringArray(
  data: ParsedFile["data"],
  key: string,
  source: string,
): readonly string[] {
  const value = data[key];
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`${source}: "${key}"는 문자열 목록이어야 합니다.`);
  }
  return value.map((item: string) => item.trim());
}

export function readNumber(data: ParsedFile["data"], key: string, source: string): number {
  const value = data[key];
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${source}: frontmatter에 숫자 "${key}"가 필요합니다.`);
  }
  return value;
}
