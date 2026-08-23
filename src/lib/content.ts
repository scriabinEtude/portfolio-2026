import { parseFrontmatter, readDate, readString, readStringArray } from "./frontmatter";
import { assertImages } from "./images";
import type { Post, PostMeta } from "./types";

type RawFiles = Record<string, string>;

const postFiles = import.meta.glob("../content/posts/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as RawFiles;

function slugOf(path: string): string {
  return path.split("/").pop()!.replace(/\.md$/, "");
}

// 코드블럭 안의 주석은 예제일 수 있으니 남기고, 본문의 <!-- --> 만 걷어낸다.
const FENCE_OR_COMMENT = /(```[\s\S]*?```)|<!--[\s\S]*?-->/g;

/**
 * 화면에 내보내지 않을 메모를 지운다.
 * 초고를 쓰는 동안 "여기 그래프" 같은 표시를 파일에 남겨 두기 위한 것으로,
 * react-markdown은 HTML 주석을 글자 그대로 찍기 때문에 미리 잘라 낸다.
 */
function stripComments(body: string): string {
  return body
    .replace(FENCE_OR_COMMENT, (_match, fence: string | undefined) => fence ?? "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function toPost(path: string, raw: string): Post {
  const source = `content/posts/${slugOf(path)}.md`;
  const { data, body: rawBody } = parseFrontmatter(raw, source);
  const body = stripComments(rawBody);
  assertImages(body, source);
  return {
    slug: slugOf(path),
    title: readString(data, "title", source),
    date: readDate(data, "date", source),
    category: readString(data, "category", source),
    summary: readString(data, "summary", source),
    tags: readStringArray(data, "tags", source),
    body,
  };
}

/** 최신 글이 위로. */
export const posts: readonly Post[] = Object.entries(postFiles)
  .map(([path, raw]) => toPost(path, raw))
  .sort((a, b) => b.date.localeCompare(a.date));

export function findPost(slug: string | undefined): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

/** 글에 실제로 쓰인 카테고리만, 처음 등장한 순서대로. */
export function listCategories(items: readonly PostMeta[]): readonly string[] {
  return [...new Set(items.map((item) => item.category))];
}

export function filterByCategory(
  items: readonly Post[],
  category: string | null,
): readonly Post[] {
  if (category === null) return items;
  return items.filter((item) => item.category === category);
}

const MARKUP = /```[\s\S]*?```|[#>*_`\-[\]()!|]/g;
const CHARS_PER_MINUTE = 450;

/** 대략적인 읽는 시간(분). 마크다운 기호는 빼고 센다. */
export function readingMinutes(body: string): number {
  const text = body.replace(MARKUP, "").replace(/\s+/g, "");
  return Math.max(1, Math.round(text.length / CHARS_PER_MINUTE));
}

/** 2026-03-12 → 2026.03 */
export function formatMonth(date: string): string {
  return date.slice(0, 7).replace("-", ".");
}

/** 2026-03-12 → 2026.03.12 */
export function formatDate(date: string): string {
  return date.replaceAll("-", ".");
}
