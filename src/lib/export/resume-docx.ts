import profileUrl from "../../assets/profile-round.png";
import { formatMonths, formatPeriod, joinValues, toBullet, totalMonths } from "../resume";
import { absoluteUrl, site } from "../site";
import type {
  BulletInput,
  Claim,
  Fact,
  Resume,
  ResumeProject,
  ResumeRecord,
  ResumeSection,
} from "../types";
import {
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

const LABEL_WIDTH = 1701; // 30mm
const WHEN_WIDTH = 1701;
const PROJECT_INDENT = 340; // 6mm
const PHOTO_WIDTH = 1587; // 28mm
const PHOTO_PX = { width: 106, height: 106 };

/** 이력서 구조를 그대로 Word 문서로 옮긴다. docx는 누를 때만 불러온다. */
export async function buildResumeDocx(resume: Resume): Promise<Blob> {
  const d = await import("docx");

  const photo = await loadProfile();

  const doc = new d.Document({
    creator: site.name,
    title: `${site.name} 이력서`,
    description: `${site.name} · ${site.role}`,
    styles: {
      default: {
        document: {
          run: { font: FONT, size: 19, color: INK_2 },
          paragraph: { spacing: { line: 300, after: 60 } },
        },
      },
    },
    sections: [
      {
        properties: { page: { margin: PAGE_MARGIN } },
        children: [
          ...hero(d, photo),
          ...resume.sections.flatMap((s) => section(d, s, resume.updated)),
        ],
      },
    ],
  });

  return d.Packer.toBlob(doc);
}

/** 증명사진을 바이트로 읽는다. 못 읽으면 사진 없이 만든다. */
async function loadProfile(): Promise<ArrayBuffer | null> {
  try {
    const response = await fetch(profileUrl);
    if (!response.ok) return null;
    return await response.arrayBuffer();
  } catch {
    return null;
  }
}

/* ── 조각들 ────────────────────────────────────────────── */

function contactLine(d: Docx, label: string, value: string, url?: string) {
  return new d.Paragraph({
    tabStops: [{ type: d.TabStopType.LEFT, position: LABEL_WIDTH }],
    spacing: { after: 40 },
    children: [
      text(d, label, { size: 18, color: INK, bold: true }),
      new d.TextRun({ children: [new d.Tab()], font: FONT, size: 19, color: INK_2 }),
      url === undefined ? text(d, value) : hyperlink(d, value, url),
    ],
  });
}

function hero(d: Docx, photo: ArrayBuffer | null): Child[] {
  const identity = [
    new d.Paragraph({
      spacing: { after: 60 },
      children: [text(d, site.name, { size: 44, color: INK, bold: true })],
    }),
    new d.Paragraph({
      spacing: { after: 200 },
      children: [text(d, site.role, { size: 24, color: INK_2 })],
    }),
    contactLine(d, "이메일", site.email, `mailto:${site.email}`),
    contactLine(d, "포트폴리오", site.portfolioUrl, absoluteUrl(site.portfolioPath)),
  ];

  // 문단 하나에 아래 테두리만 줘서 가로 괘선으로 쓴다
  const rule = new d.Paragraph({
    spacing: { before: 200, after: 200 },
    border: { bottom: { style: d.BorderStyle.SINGLE, size: 6, color: RULE, space: 2 } },
    children: [],
  });

  if (photo === null) return [...identity, rule];

  const image = new d.Paragraph({
    alignment: d.AlignmentType.RIGHT,
    spacing: { after: 0 },
    children: [new d.ImageRun({ type: "png", data: photo, transformation: PHOTO_PX })],
  });

  return [grid(d, [CONTENT_WIDTH - PHOTO_WIDTH, PHOTO_WIDTH], [[identity, [image]]]), rule];
}

function sectionTitle(d: Docx, title: string, total?: string) {
  const children = [text(d, title, { size: 20, color: INK, bold: true })];
  if (total) {
    children.push(
      new d.TextRun({
        children: [new d.Tab(), `총 ${total}`],
        font: FONT,
        size: 18,
        color: INK_2,
      }),
    );
  }

  return new d.Paragraph({
    spacing: { before: 300, after: 140 },
    tabStops: [{ type: d.TabStopType.RIGHT, position: CONTENT_WIDTH }],
    border: { bottom: { style: d.BorderStyle.SINGLE, size: 6, color: RULE, space: 6 } },
    children,
  });
}

function section(d: Docx, input: ResumeSection, asOf: string): Child[] {
  switch (input.kind) {
    case "prose":
      return [
        sectionTitle(d, input.title),
        ...input.paragraphs.map((p) => new d.Paragraph({ children: [text(d, p)] })),
      ];

    case "claims":
      return [sectionTitle(d, input.title), ...input.claims.map((c) => claim(d, c))];

    case "records": {
      const total = input.showTotal
        ? formatMonths(totalMonths(input.records, asOf))
        : undefined;
      return [sectionTitle(d, input.title, total), ...input.records.flatMap((r) => job(d, r))];
    }

    case "rows":
      return [
        sectionTitle(d, input.title),
        grid(
          d,
          [LABEL_WIDTH, CONTENT_WIDTH - LABEL_WIDTH],
          input.rows.map((row) => [
            [label(d, row.key)],
            [new d.Paragraph({ children: [text(d, joinValues(row.values))] })],
          ]),
        ),
      ];

    case "facts":
      return [
        sectionTitle(d, input.title),
        grid(
          d,
          [LABEL_WIDTH, CONTENT_WIDTH - LABEL_WIDTH - WHEN_WIDTH, WHEN_WIDTH],
          input.facts.map((fact) => factRow(d, fact)),
        ),
      ];
  }
}

/** 앞머리를 굵게 두고 근거를 이어 붙인다. */
function claim(d: Docx, input: Claim) {
  return new d.Paragraph({
    bullet: { level: 0 },
    indent: { left: 360 },
    spacing: { after: 100 },
    children: [text(d, `${input.lead} `, { color: INK, bold: true }), text(d, input.body)],
  });
}

function label(d: Docx, value: string) {
  return new d.Paragraph({
    spacing: { after: 0 },
    children: [text(d, value, { size: 18, color: INK, bold: true })],
  });
}

function factRow(d: Docx, fact: Fact): Para[][] {
  const value = fact.detail ? `${fact.title} ${fact.detail}` : fact.title;
  return [
    [label(d, fact.label ?? "")],
    [new d.Paragraph({ spacing: { after: 0 }, children: [text(d, value)] })],
    [
      new d.Paragraph({
        alignment: d.AlignmentType.RIGHT,
        spacing: { after: 0 },
        children: [text(d, fact.when ?? "", { size: 18, color: INK_2 })],
      }),
    ],
  ];
}

/* ── 경력 ──────────────────────────────────────────────── */

function job(d: Docx, record: ResumeRecord): Para[] {
  const paragraphs: Para[] = [
    // 회사명은 왼쪽, 기간은 오른쪽 탭 정지점에 붙인다.
    new d.Paragraph({
      spacing: { before: 180, after: 0 },
      tabStops: [{ type: d.TabStopType.RIGHT, position: CONTENT_WIDTH }],
      children: [
        text(d, record.title, { size: 24, color: INK, bold: true }),
        new d.TextRun({
          children: [new d.Tab(), formatPeriod(record.period)],
          font: FONT,
          size: 18,
          color: INK_2,
        }),
      ],
    }),
  ];

  if (record.meta) {
    paragraphs.push(
      new d.Paragraph({
        spacing: { after: 80 },
        children: [text(d, record.meta, { size: 18, color: INK_2 })],
      }),
    );
  }

  if (record.summary) {
    paragraphs.push(new d.Paragraph({ children: [text(d, record.summary)] }));
  }

  paragraphs.push(...bullets(d, record.bullets ?? [], 0));

  for (const project of record.projects ?? []) {
    paragraphs.push(...projectParagraphs(d, project));
  }

  return paragraphs;
}

function projectParagraphs(d: Docx, project: ResumeProject): Para[] {
  const indent = { left: PROJECT_INDENT };
  const paragraphs: Para[] = [
    new d.Paragraph({
      indent,
      spacing: { before: 200, after: 20 },
      children: [text(d, project.title, { size: 20, color: INK, bold: true })],
    }),
  ];

  if (project.summary) {
    paragraphs.push(new d.Paragraph({ indent, children: [text(d, project.summary)] }));
  }

  if (project.achievements?.length) {
    paragraphs.push(
      new d.Paragraph({
        indent,
        spacing: { before: 100, after: 20 },
        children: [text(d, "주요 성과", { size: 16, color: INK, bold: true })],
      }),
    );
    paragraphs.push(...bullets(d, project.achievements, PROJECT_INDENT));
  }

  return paragraphs;
}

/** 하위 항목은 한 단계 들여쓴 글머리로 옮긴다. */
function bullets(d: Docx, items: readonly BulletInput[], offset: number): Para[] {
  const paragraphs: Para[] = [];

  for (const input of items) {
    const bullet = toBullet(input);
    paragraphs.push(
      new d.Paragraph({
        bullet: { level: 0 },
        indent: { left: offset + 360 },
        children: [
          text(d, bullet.text),
          ...(bullet.href
            ? [text(d, "  "), hyperlink(d, "글 보기", absoluteUrl(bullet.href), 18)]
            : []),
        ],
      }),
    );
    for (const item of bullet.items ?? []) {
      paragraphs.push(
        new d.Paragraph({
          bullet: { level: 1 },
          indent: { left: offset + 720 },
          children: [text(d, item, { size: 18, color: INK_2 })],
        }),
      );
    }
  }

  return paragraphs;
}

/* ── 라벨 격자 ─────────────────────────────────────────────
   화면의 라벨-값 격자를 Word에서는 테두리 없는 표로 재현한다. */

function grid(d: Docx, widths: readonly number[], rows: readonly Para[][][]) {
  const none = { style: d.BorderStyle.NONE, size: 0, color: "auto" };

  return new d.Table({
    width: { size: CONTENT_WIDTH, type: d.WidthType.DXA },
    columnWidths: [...widths],
    borders: {
      top: none,
      bottom: none,
      left: none,
      right: none,
      insideHorizontal: none,
      insideVertical: none,
    },
    rows: rows.map(
      (cells) =>
        new d.TableRow({
          cantSplit: true,
          children: cells.map(
            (children, index) =>
              new d.TableCell({
                width: { size: widths[index], type: d.WidthType.DXA },
                margins: { top: 0, bottom: 120, left: 0, right: index === 0 ? 227 : 0 },
                children: children.length > 0 ? [...children] : [new d.Paragraph({})],
              }),
          ),
        }),
    ),
  });
}
