import { site } from "../site";
import type { Resume, ResumeRecord, ResumeSection } from "../types";

type Docx = typeof import("docx");
type Child = InstanceType<Docx["Paragraph"]> | InstanceType<Docx["Table"]>;

/* 화면과 같은 판형을 Word로 옮긴다. A4, 좌우 18mm 여백, 판면 174mm.
   길이 단위는 twip(1440 twip = 1인치). */
const PAGE_MARGIN = { top: 907, bottom: 907, left: 1021, right: 1021 };
const RAIL_WIDTH = 1701; // 30mm
const BODY_WIDTH = 8164; // 144mm
const TABLE_WIDTH = RAIL_WIDTH + BODY_WIDTH;

/** Word 기본 한글 글꼴. 맥·윈도 양쪽에서 안전한 조합. */
const FONT = { ascii: "Arial", eastAsia: "맑은 고딕", hAnsi: "Arial" };

const INK = "17191C";
const INK_2 = "4B5057";
const INK_3 = "7C828A";
const RULE = "D1CEC7";
const MARK = "1F3FA8";

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
        children: [...masthead(d, resume), ...resume.sections.flatMap((s) => section(d, s))],
      },
    ],
  });

  return d.Packer.toBlob(doc);
}

/* ── 조각들 ────────────────────────────────────────────── */

function text(d: Docx, value: string, options: { size?: number; color?: string; bold?: boolean } = {}) {
  return new d.TextRun({
    text: value,
    font: FONT,
    size: options.size ?? 19,
    color: options.color ?? INK_2,
    bold: options.bold ?? false,
  });
}

function masthead(d: Docx, resume: Resume): Child[] {
  const contacts = [site.email, site.githubHandle].join("   ·   ");

  return [
    new d.Paragraph({
      spacing: { after: 40 },
      children: [text(d, site.name, { size: 44, color: INK, bold: true })],
    }),
    new d.Paragraph({
      spacing: { after: 100 },
      children: [text(d, `${site.role} · ${site.roleEn}`, { size: 21, color: INK_2 })],
    }),
    new d.Paragraph({
      spacing: { after: 100 },
      children: [text(d, resume.tagline, { size: 19, color: INK_2 })],
    }),
    new d.Paragraph({
      spacing: { after: 240 },
      border: { bottom: { style: d.BorderStyle.SINGLE, size: 6, color: RULE, space: 8 } },
      children: [text(d, contacts, { size: 17, color: INK_3 })],
    }),
  ];
}

function heading(d: Docx, title: string) {
  return new d.Paragraph({
    spacing: { before: 320, after: 140 },
    border: { bottom: { style: d.BorderStyle.SINGLE, size: 6, color: RULE, space: 6 } },
    children: [text(d, title, { size: 24, color: INK, bold: true })],
  });
}

function section(d: Docx, input: ResumeSection): Child[] {
  switch (input.kind) {
    case "prose":
      return [
        heading(d, input.title),
        register(d, [
          {
            rail: [],
            body: input.paragraphs.map((p) => new d.Paragraph({ children: [text(d, p)] })),
          },
        ]),
      ];

    case "records":
      return [heading(d, input.title), register(d, input.records.map((r) => recordRow(d, r)))];

    case "matrix":
      return [
        heading(d, input.title),
        register(
          d,
          input.rows.map((row) => ({
            rail: [railText(d, row.key)],
            body: [new d.Paragraph({ children: [text(d, row.values.join("  ·  "))] })],
          })),
        ),
      ];

    case "list":
      return [
        heading(d, input.title),
        register(d, [
          {
            rail: [],
            body: input.items.map(
              (item) => new d.Paragraph({ bullet: { level: 0 }, children: [text(d, item)] }),
            ),
          },
        ]),
      ];
  }
}

function railText(d: Docx, value: string) {
  return new d.Paragraph({
    alignment: d.AlignmentType.RIGHT,
    spacing: { after: 0, line: 280 },
    children: [text(d, value, { size: 17, color: INK_3 })],
  });
}

function recordRow(d: Docx, record: ResumeRecord): RegisterRow {
  const { from, to, note } = record.key;
  const period = [from, to].filter(Boolean).join(" – ");

  const rail = [period, note].filter((v): v is string => Boolean(v)).map((v) => railText(d, v));

  const body: InstanceType<Docx["Paragraph"]>[] = [
    new d.Paragraph({
      spacing: { after: 20 },
      children: [text(d, record.title, { size: 21, color: INK, bold: true })],
    }),
  ];

  if (record.meta) {
    body.push(
      new d.Paragraph({
        spacing: { after: 60 },
        children: [text(d, record.meta, { size: 18, color: INK_3 })],
      }),
    );
  }

  if (record.summary) {
    body.push(new d.Paragraph({ children: [text(d, record.summary)] }));
  }

  for (const bullet of record.bullets ?? []) {
    body.push(new d.Paragraph({ bullet: { level: 0 }, children: [text(d, bullet)] }));
  }

  if (record.results?.length) {
    body.push(
      new d.Paragraph({
        spacing: { before: 80, after: 20 },
        children: [text(d, "결과", { size: 16, color: INK_3, bold: true })],
      }),
    );
    for (const result of record.results) {
      body.push(
        new d.Paragraph({ bullet: { level: 0 }, children: [text(d, result, { color: MARK })] }),
      );
    }
  }

  if (record.stack?.length) {
    body.push(
      new d.Paragraph({
        spacing: { before: 60 },
        children: [text(d, record.stack.join("  ·  "), { size: 17, color: INK_3 })],
      }),
    );
  }

  return { rail, body };
}

/* ── 레일 격자 ─────────────────────────────────────────────
   화면의 2열 레지스터를 Word에서는 테두리 없는 표로 재현한다. */

type RegisterRow = {
  readonly rail: readonly InstanceType<Docx["Paragraph"]>[];
  readonly body: readonly InstanceType<Docx["Paragraph"]>[];
};

function register(d: Docx, rows: readonly RegisterRow[]) {
  const none = { style: d.BorderStyle.NONE, size: 0, color: "auto" };
  const blank = () => new d.Paragraph({ children: [] });

  return new d.Table({
    width: { size: TABLE_WIDTH, type: d.WidthType.DXA },
    columnWidths: [RAIL_WIDTH, BODY_WIDTH],
    borders: { top: none, bottom: none, left: none, right: none, insideHorizontal: none, insideVertical: none },
    rows: rows.map(
      (row) =>
        new d.TableRow({
          cantSplit: true,
          children: [
            new d.TableCell({
              width: { size: RAIL_WIDTH, type: d.WidthType.DXA },
              margins: { top: 0, bottom: 220, left: 0, right: 340 },
              children: row.rail.length > 0 ? [...row.rail] : [blank()],
            }),
            new d.TableCell({
              width: { size: BODY_WIDTH, type: d.WidthType.DXA },
              margins: { top: 0, bottom: 220, left: 0, right: 0 },
              children: row.body.length > 0 ? [...row.body] : [blank()],
            }),
          ],
        }),
    ),
  });
}
