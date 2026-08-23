import type {
  Blockquote,
  Code,
  Heading,
  Image,
  List,
  Paragraph as MdParagraph,
  PhrasingContent,
  Root,
  RootContent,
  Table,
  TableRow,
} from "mdast";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { absoluteUrl } from "../site";
import { type DocxImage, loadDocxImage } from "./docx-image";
import {
  BODY_SIZE,
  CONTENT_WIDTH,
  type Child,
  type Docx,
  hyperlink,
  INK,
  INK_2,
  type Para,
  RULE,
  type Run,
  type RunOptions,
  SHADE,
  text,
} from "./docx-kit";

/**
 * 마크다운 본문을 Word 조각으로 옮긴다.
 * 화면 렌더러(react-markdown)와 같은 문법(GFM)을 읽어 같은 것이 보이게 한다.
 */

const parser = unified().use(remarkParse).use(remarkGfm);

export function parseMarkdown(body: string): Root {
  return parser.parse(body);
}

/* ── 그림 ──────────────────────────────────────────────────
   Word 조립은 동기 코드다. 본문에 나오는 그림은 미리 다 읽어 둔다. */

export type ImageBook = ReadonlyMap<string, DocxImage>;

export async function loadMarkdownImages(roots: readonly Root[]): Promise<ImageBook> {
  const sources = new Set<string>();
  for (const root of roots) collectImages(root, sources);

  const loaded = await Promise.all(
    [...sources].map(async (src) => [src, await loadDocxImage(src)] as const),
  );

  return new Map(loaded.filter((entry): entry is [string, DocxImage] => entry[1] !== null));
}

function collectImages(node: Root | RootContent, into: Set<string>): void {
  if (node.type === "image") {
    into.add(node.url);
    return;
  }
  if (!("children" in node)) return;
  for (const child of node.children as RootContent[]) collectImages(child, into);
}

/* ── 본문 ──────────────────────────────────────────────── */

/** 들여쓰기와 인용 여부를 물고 내려가는 조립 상태. */
type Context = {
  readonly d: Docx;
  readonly images: ImageBook;
  /** 왼쪽 들여쓰기(twip). 목록·인용 안으로 들어갈수록 커진다. */
  readonly indent: number;
  readonly quoted: boolean;
};

const HEADING_SIZE: Record<number, number> = { 1: 26, 2: 23, 3: 20 };
const CODE_SIZE = 17;
const SMALL = 17;
const STEP = 360; // 목록 한 단계 들여쓰기
const QUOTE_INDENT = 340;
/** 지면(174mm)에 들어가는 그림의 최대 폭(px, 96dpi 기준). */
const MAX_IMAGE_PX = 620;

export function markdownToDocx(d: Docx, root: Root, images: ImageBook): Child[] {
  return blocks({ d, images, indent: 0, quoted: false }, root.children);
}

function blocks(ctx: Context, nodes: readonly RootContent[]): Child[] {
  return nodes.flatMap((node) => block(ctx, node));
}

function block(ctx: Context, node: RootContent): Child[] {
  switch (node.type) {
    case "heading":
      return [heading(ctx, node)];
    case "paragraph":
      return paragraph(ctx, node);
    case "list":
      return list(ctx, node, 0);
    case "code":
      return code(ctx, node);
    case "blockquote":
      return quote(ctx, node);
    case "table":
      return [table(ctx, node)];
    case "thematicBreak":
      return [rule(ctx)];
    case "footnoteDefinition":
      return blocks(indented(ctx, STEP), node.children);
    // html(주석 등)·정의는 화면에서도 보이지 않는다.
    default:
      return [];
  }
}

function indented(ctx: Context, by: number): Context {
  return { ...ctx, indent: ctx.indent + by };
}

function heading(ctx: Context, node: Heading): Para {
  const size = HEADING_SIZE[node.depth] ?? BODY_SIZE;
  return new ctx.d.Paragraph({
    spacing: { before: node.depth <= 2 ? 320 : 240, after: 120 },
    indent: { left: ctx.indent },
    keepNext: true,
    children: runs(ctx, node.children, { size, color: INK, bold: true }),
  });
}

function paragraph(ctx: Context, node: MdParagraph): Child[] {
  const only = loneImage(node);
  if (only !== undefined) return figure(ctx, only);

  return [
    new ctx.d.Paragraph({
      spacing: { before: 60, after: 120 },
      indent: { left: ctx.indent },
      border: ctx.quoted ? quoteBorder(ctx) : undefined,
      children: runs(ctx, node.children),
    }),
  ];
}

/** 그림 하나뿐인 문단. 화면에서 figure로 나오는 것과 같은 자리다. */
function loneImage(node: MdParagraph): Image | undefined {
  const kids = node.children.filter((child) => child.type !== "text" || child.value.trim() !== "");
  return kids.length === 1 && kids[0].type === "image" ? kids[0] : undefined;
}

function figure(ctx: Context, node: Image): Para[] {
  const caption = node.alt ?? "";
  const loaded = ctx.images.get(node.url);

  // 못 읽은 그림은 빈 자리를 남기지 않고 설명만 남긴다.
  if (loaded === undefined) {
    return caption === "" ? [] : [captionLine(ctx, caption)];
  }

  const image = new ctx.d.Paragraph({
    spacing: { before: 200, after: caption === "" ? 200 : 60 },
    indent: { left: ctx.indent },
    children: [
      new ctx.d.ImageRun({
        type: loaded.type,
        data: loaded.data,
        transformation: fit(loaded),
        altText: caption === "" ? undefined : { name: caption, description: caption },
      }),
    ],
  });

  return caption === "" ? [image] : [image, captionLine(ctx, caption)];
}

/** 원본이 지면보다 넓으면 줄인다. 작은 그림을 늘리지는 않는다. */
function fit(image: DocxImage): { width: number; height: number } {
  const scale = Math.min(1, MAX_IMAGE_PX / image.width);
  return {
    width: Math.round(image.width * scale),
    height: Math.round(image.height * scale),
  };
}

function captionLine(ctx: Context, value: string): Para {
  return new ctx.d.Paragraph({
    spacing: { after: 200 },
    indent: { left: ctx.indent },
    children: [text(ctx.d, value, { size: SMALL, color: INK_2 })],
  });
}

/* ── 목록 ──────────────────────────────────────────────────
   번호 목록은 Word의 번호 매기기 대신 "1." 을 글자로 적는다.
   문서 하나에 여러 글을 이어 붙이므로 번호가 글을 넘어 이어지면 안 된다. */

function list(ctx: Context, node: List, depth: number): Child[] {
  const start = node.start ?? 1;

  return node.children.flatMap((item, index) => {
    const [head, ...rest] = item.children;
    const marker = node.ordered ? `${start + index}. ` : checkbox(item.checked);

    const first =
      head === undefined
        ? []
        : head.type === "paragraph"
          ? [listLine(ctx, head, depth, marker, node.ordered === true)]
          : block(ctx, head);

    // 같은 항목에 딸린 문단·중첩 목록은 한 단계 더 들여쓴다.
    const following = rest.flatMap((child) =>
      child.type === "list"
        ? list(ctx, child, depth + 1)
        : block(indented(ctx, STEP * (depth + 1)), child),
    );

    return [...first, ...following];
  });
}

/** 할 일 목록의 네모. 화면에서는 체크상자로 보이는 자리다. */
function checkbox(checked: boolean | null | undefined): string | undefined {
  if (checked === null || checked === undefined) return undefined;
  return checked ? "☑ " : "☐ ";
}

function listLine(
  ctx: Context,
  node: MdParagraph,
  depth: number,
  marker: string | undefined,
  ordered: boolean,
): Para {
  const left = ctx.indent + STEP * (depth + 1);

  // 번호 목록은 "1."을 글자로 적고 그만큼 매달아 들여쓴다.
  if (ordered) {
    return new ctx.d.Paragraph({
      indent: { left, hanging: 240 },
      spacing: { after: 60 },
      children: [text(ctx.d, marker ?? ""), ...runs(ctx, node.children)],
    });
  }

  // 그 밖에는 Word의 기본 글머리 기호를 쓴다. 할 일 목록이면 네모가 앞에 붙는다.
  return new ctx.d.Paragraph({
    bullet: { level: Math.min(depth, 2) },
    indent: { left },
    spacing: { after: 60 },
    children: [
      ...(marker === undefined ? [] : [text(ctx.d, marker)]),
      ...runs(ctx, node.children),
    ],
  });
}

/* ── 코드·인용·괘선 ────────────────────────────────────── */

/** 줄마다 문단 하나. 바탕색이 이어져 한 덩어리로 보인다. */
function code(ctx: Context, node: Code): Para[] {
  const lines = node.value.split("\n");

  return lines.map(
    (line, index) =>
      new ctx.d.Paragraph({
        shading: { type: ctx.d.ShadingType.CLEAR, color: "auto", fill: SHADE },
        indent: { left: ctx.indent + 170, right: 170 },
        spacing: {
          before: index === 0 ? 160 : 0,
          after: index === lines.length - 1 ? 160 : 0,
          line: 260,
        },
        children: [text(ctx.d, line === "" ? " " : line, { mono: true, size: CODE_SIZE })],
      }),
  );
}

function quoteBorder(ctx: Context) {
  return {
    left: { style: ctx.d.BorderStyle.SINGLE, size: 12, color: RULE, space: 10 },
  };
}

function quote(ctx: Context, node: Blockquote): Child[] {
  return blocks({ ...indented(ctx, QUOTE_INDENT), quoted: true }, node.children);
}

function rule(ctx: Context): Para {
  return new ctx.d.Paragraph({
    spacing: { before: 200, after: 200 },
    border: { bottom: { style: ctx.d.BorderStyle.SINGLE, size: 6, color: RULE, space: 2 } },
    children: [],
  });
}

/* ── 표 ────────────────────────────────────────────────── */

function table(ctx: Context, node: Table): Child {
  const columns = Math.max(1, ...node.children.map((row) => row.children.length));
  const width = Math.floor((CONTENT_WIDTH - ctx.indent) / columns);
  const none = { style: ctx.d.BorderStyle.NONE, size: 0, color: "auto" };
  const line = { style: ctx.d.BorderStyle.SINGLE, size: 4, color: RULE };

  return new ctx.d.Table({
    width: { size: CONTENT_WIDTH - ctx.indent, type: ctx.d.WidthType.DXA },
    columnWidths: Array.from({ length: columns }, () => width),
    indent: ctx.indent > 0 ? { size: ctx.indent, type: ctx.d.WidthType.DXA } : undefined,
    borders: {
      top: none,
      bottom: line,
      left: none,
      right: none,
      insideHorizontal: line,
      insideVertical: none,
    },
    rows: node.children.map((row, index) => tableRow(ctx, row, columns, width, index === 0)),
  });
}

function tableRow(ctx: Context, row: TableRow, columns: number, width: number, head: boolean) {
  const cells = Array.from({ length: columns }, (_, index) => row.children[index]);

  return new ctx.d.TableRow({
    tableHeader: head,
    children: cells.map(
      (cell) =>
        new ctx.d.TableCell({
          width: { size: width, type: ctx.d.WidthType.DXA },
          margins: { top: 80, bottom: 80, left: 0, right: 170 },
          children: [
            new ctx.d.Paragraph({
              spacing: { after: 0 },
              children:
                cell === undefined
                  ? []
                  : runs(ctx, cell.children, head ? { size: SMALL, color: INK, bold: true } : {}),
            }),
          ],
        }),
    ),
  });
}

/* ── 한 줄 안의 조각 ───────────────────────────────────── */

function runs(
  ctx: Context,
  nodes: readonly PhrasingContent[],
  style: RunOptions = {},
): readonly Run[] {
  return nodes.flatMap((node) => run(ctx, node, style));
}

function run(ctx: Context, node: PhrasingContent, style: RunOptions): readonly Run[] {
  switch (node.type) {
    case "text":
      return [text(ctx.d, soften(node.value), style)];

    case "strong":
      return runs(ctx, node.children, { ...style, bold: true, color: INK });

    case "emphasis":
      return runs(ctx, node.children, { ...style, italics: true });

    case "delete":
      return runs(ctx, node.children, { ...style, strike: true });

    case "inlineCode":
      return [text(ctx.d, node.value, { ...style, mono: true, size: CODE_SIZE, color: INK })];

    case "link":
      return [hyperlink(ctx.d, plain(node.children), linkUrl(node.url), style.size ?? BODY_SIZE)];

    case "break":
      return [new ctx.d.TextRun({ break: 1 })];

    // 본문에 섞인 그림은 문단 하나짜리 그림에서만 다룬다. 여기서는 설명만 남긴다.
    case "image":
      return node.alt ? [text(ctx.d, node.alt, { ...style, size: SMALL })] : [];

    default:
      return [];
  }
}

/**
 * 원고에서 접어 쓴 줄바꿈은 한 칸으로 편다.
 * 화면(HTML)도 같은 자리를 공백 하나로 읽는다.
 */
function soften(value: string): string {
  return value.replace(/\s*\n\s*/g, " ");
}

/** 링크 글자만 뽑는다. Word 링크 안에서는 굵기·기울임을 따로 두지 않는다. */
function plain(nodes: readonly PhrasingContent[]): string {
  return nodes
    .map((node) => {
      if (node.type === "text" || node.type === "inlineCode") return node.value;
      if ("children" in node) return plain(node.children as PhrasingContent[]);
      return "";
    })
    .join("");
}

/** 사이트 안을 가리키는 링크는 절대 주소로 바꾼다. 문서는 사이트 밖에서 열린다. */
function linkUrl(url: string): string {
  return url.startsWith("/") ? absoluteUrl(url) : url;
}
