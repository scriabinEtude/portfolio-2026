import GithubSlugger from "github-slugger";

export type Heading = {
  readonly id: string;
  readonly text: string;
  readonly level: 2 | 3;
};

const FENCE = /^\s*```/;
const HEADING = /^(#{2,3})\s+(.+?)\s*$/;
const INLINE_MARKUP = /[*_`]/g;

/**
 * 목차용으로 본문에서 h2·h3만 뽑는다.
 * id는 rehype-slug와 같은 github-slugger를 써서 본문 앵커와 반드시 맞춘다.
 */
export function extractHeadings(body: string): readonly Heading[] {
  const slugger = new GithubSlugger();
  const found: Heading[] = [];
  let inFence = false;

  for (const line of body.split("\n")) {
    if (FENCE.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = HEADING.exec(line);
    if (!match) continue;

    const text = match[2].replace(INLINE_MARKUP, "").trim();
    found.push({
      id: slugger.slug(text),
      text,
      level: match[1].length === 2 ? 2 : 3,
    });
  }

  return found;
}
