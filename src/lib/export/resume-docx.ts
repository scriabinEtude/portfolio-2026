import { formatPeriod, joinValues, toBullet } from "../resume";
import { site } from "../site";
import type {
  BulletInput,
  Fact,
  Resume,
  ResumeProject,
  ResumeRecord,
  ResumeSection,
} from "../types";

type Docx = typeof import("docx");
type Para = InstanceType<Docx["Paragraph"]>;
type Child = Para | InstanceType<Docx["Table"]>;

/* A4, 좌우 18mm 여백. 길이 단위는 twip(1440 twip = 1인치, 1mm ≈ 56.7 twip). */
const PAGE_MARGIN = { top: 907, bottom: 907, left: 1021, right: 1021 };
const CONTENT_WIDTH = 9865; // 174mm
const LABEL_WIDTH = 1701; // 30mm
const WHEN_WIDTH = 1701;
const PROJECT_INDENT = 340; // 6mm

/** Word 기본 한글 글꼴. 맥·윈도 양쪽에서 안전한 조합. */
const FONT = { ascii: "Arial", eastAsia: "맑은 고딕", hAnsi: "Arial" };

/* 화면과 같은 기준. 옅은 회색 글씨는 두지 않는다. */
const INK = "14161A";
const INK_2 = "24272C";
const RULE = "DCDCE0";

type RunOptions = {
  size?: number;
  color?: string;
  bold?: boolean;
};

/** 이력서 구조를 그대로 Word 문서로 옮긴다. docx는 누를 때만 불러온다. */
export async function buildResumeDocx(resume: Resume): Promise<Blob> {
  const d = await import("docx");

  const doc = new d.Document({
    creator: site.name,
    title: `${site.name} 이력서`,
    description: resume.tagline,
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
        children: [...hero(d, resume), ...resume.sections.flatMap((s) => section(d, s))],
      },
    ],
  });

  return d.Packer.toBlob(doc);
}

/* ── 조각들 ────────────────────────────────────────────── */

function text(d: Docx, value: string, options: RunOptions = {}) {
  return new d.TextRun({
    text: value,
    font: FONT,
    size: options.size ?? 19,
    color: options.color ?? INK_2,
    bold: options.bold ?? false,
  });
}

function hero(d: Docx, resume: Resume): Child[] {
  return [
    new d.Paragraph({
      spacing: { after: 40 },
      children: [text(d, site.name, { size: 44, color: INK, bold: true })],
    }),
    new d.Paragraph({
      spacing: { after: 120 },
      children: [text(d, `${site.role} · ${site.roleEn}`, { size: 21, color: INK_2 })],
    }),
    new d.Paragraph({
      spacing: { after: 120 },
      children: [text(d, resume.tagline)],
    }),
    new d.Paragraph({
      spacing: { after: 200 },
      border: { bottom: { style: d.BorderStyle.SINGLE, size: 6, color: RULE, space: 8 } },
      children: [
        text(d, [site.email, site.githubHandle].join("   ·   "), { size: 17, color: INK_2 }),
      ],
    }),
  ];
}

function sectionTitle(d: Docx, title: string) {
  return new d.Paragraph({
    spacing: { before: 300, after: 140 },
    border: { bottom: { style: d.BorderStyle.SINGLE, size: 6, color: RULE, space: 6 } },
    children: [text(d, title, { size: 20, color: INK, bold: true })],
  });
}

function section(d: Docx, input: ResumeSection): Child[] {
  switch (input.kind) {
    case "prose":
      return [
        sectionTitle(d, input.title),
        ...input.paragraphs.map((p) => new d.Paragraph({ children: [text(d, p)] })),
      ];

    case "records":
      return [sectionTitle(d, input.title), ...input.records.flatMap((r) => job(d, r))];

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
        children: [text(d, bullet.text)],
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
