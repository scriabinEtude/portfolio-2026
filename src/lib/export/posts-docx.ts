import { formatDate, readingMinutes, today } from "../content";
import { absoluteUrl, site } from "../site";
import type { Post } from "../types";
import {
  BODY_SIZE,
  CONTENT_WIDTH,
  type Child,
  type Docx,
  FONT,
  hyperlink,
  INK,
  INK_2,
  PAGE_MARGIN,
  type Para,
  RULE,
  text,
} from "./docx-kit";
import { type ImageBook, loadMarkdownImages, markdownToDocx, parseMarkdown } from "./markdown-docx";

/**
 * 포트폴리오 글 전체를 Word 문서 하나로 묶는다.
 * 표지와 차례를 앞에 두고, 글은 한 편씩 새 쪽에서 시작한다.
 */

const SMALL = 17;
const META = 18;

export async function buildPostsDocx(items: readonly Post[]): Promise<Blob> {
  const d = await import("docx");

  const roots = items.map((post) => parseMarkdown(post.body));
  const images = await loadMarkdownImages(roots);

  const doc = new d.Document({
    creator: site.name,
    title: `${site.name} 포트폴리오`,
    description: `${site.name} · ${site.role} — 글 ${items.length}편`,
    styles: {
      default: {
        document: {
          run: { font: FONT, size: BODY_SIZE, color: INK_2 },
          paragraph: { spacing: { line: 320, after: 60 } },
        },
      },
    },
    sections: [
      {
        properties: { page: { margin: PAGE_MARGIN } },
        footers: { default: pageFooter(d) },
        children: [
          ...cover(d, items),
          ...items.flatMap((post, index) => article(d, post, roots[index], images)),
        ],
      },
    ],
  });

  return d.Packer.toBlob(doc);
}

function pageFooter(d: Docx) {
  return new d.Footer({
    children: [
      new d.Paragraph({
        alignment: d.AlignmentType.CENTER,
        spacing: { before: 120, after: 0 },
        children: [
          new d.TextRun({
            children: [d.PageNumber.CURRENT],
            font: FONT,
            size: SMALL,
            color: INK_2,
          }),
        ],
      }),
    ],
  });
}

/* ── 표지와 차례 ───────────────────────────────────────── */

function cover(d: Docx, items: readonly Post[]): Child[] {
  return [
    new d.Paragraph({
      spacing: { after: 80 },
      children: [text(d, "포트폴리오", { size: META, color: INK_2, bold: true })],
    }),
    new d.Paragraph({
      spacing: { after: 60 },
      children: [text(d, `${site.name} · ${site.role}`, { size: 44, color: INK, bold: true })],
    }),
    new d.Paragraph({
      spacing: { after: 40 },
      children: [hyperlink(d, site.email, `mailto:${site.email}`, META)],
    }),
    new d.Paragraph({
      spacing: { after: 40 },
      children: [hyperlink(d, site.portfolioUrl, absoluteUrl(site.portfolioPath), META)],
    }),
    new d.Paragraph({
      spacing: { before: 120 },
      children: [
        text(d, `${formatDate(today())} 기준 · 글 ${items.length}편`, {
          size: META,
          color: INK_2,
        }),
      ],
    }),
    horizontalRule(d),
    new d.Paragraph({
      spacing: { before: 120, after: 140 },
      children: [text(d, "차례", { size: 20, color: INK, bold: true })],
    }),
    ...items.map((post, index) => indexLine(d, post, index + 1)),
  ];
}

/** 제목은 왼쪽, 날짜·분류는 오른쪽 끝에. */
function indexLine(d: Docx, post: Post, number: number): Para {
  return new d.Paragraph({
    spacing: { after: 80 },
    indent: { left: 340, hanging: 340 },
    tabStops: [{ type: d.TabStopType.RIGHT, position: CONTENT_WIDTH }],
    children: [
      text(d, `${number}. `, { color: INK_2 }),
      text(d, post.title, { color: INK }),
      new d.TextRun({
        children: [new d.Tab(), `${formatDate(post.date)} · ${post.category}`],
        font: FONT,
        size: SMALL,
        color: INK_2,
      }),
    ],
  });
}

function horizontalRule(d: Docx): Para {
  return new d.Paragraph({
    spacing: { before: 240, after: 240 },
    border: { bottom: { style: d.BorderStyle.SINGLE, size: 6, color: RULE, space: 2 } },
    children: [],
  });
}

/* ── 글 한 편 ──────────────────────────────────────────── */

function article(d: Docx, post: Post, root: ReturnType<typeof parseMarkdown>, images: ImageBook) {
  return [...articleHead(d, post), ...markdownToDocx(d, root, images)];
}

function articleHead(d: Docx, post: Post): Child[] {
  const head: Child[] = [
    new d.Paragraph({
      pageBreakBefore: true,
      spacing: { after: 80 },
      keepNext: true,
      children: [
        text(d, `${formatDate(post.date)} · ${post.category} · ${readingMinutes(post.body)}분`, {
          size: SMALL,
          color: INK_2,
        }),
      ],
    }),
    new d.Paragraph({
      spacing: { after: 100 },
      keepNext: true,
      children: [text(d, post.title, { size: 30, color: INK, bold: true })],
    }),
    new d.Paragraph({
      spacing: { after: 80 },
      children: [text(d, post.summary, { size: 20, color: INK_2 })],
    }),
  ];

  if (post.tags.length > 0) {
    head.push(
      new d.Paragraph({
        spacing: { after: 40 },
        children: [
          text(d, post.tags.map((tag) => `#${tag}`).join("  "), { size: SMALL, color: INK_2 }),
        ],
      }),
    );
  }

  head.push(
    new d.Paragraph({
      spacing: { after: 0 },
      children: [hyperlink(d, "웹에서 보기", absoluteUrl(`/portfolio/${post.slug}`), SMALL)],
    }),
    horizontalRule(d),
  );

  return head;
}
