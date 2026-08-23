/**
 * 이력서와 포트폴리오 두 Word 문서가 함께 쓰는 지면 값·색·글자 조각.
 * 화면(tokens.css)과 같은 기준을 Word 단위로 옮겨 둔 것이다.
 */

export type Docx = typeof import("docx");
export type Para = InstanceType<Docx["Paragraph"]>;
export type Child = Para | InstanceType<Docx["Table"]>;
/** 문단 안에 들어가는 조각. */
export type Run =
  | InstanceType<Docx["TextRun"]>
  | InstanceType<Docx["ExternalHyperlink"]>
  | InstanceType<Docx["ImageRun"]>;

/* A4, 좌우 18mm 여백. 길이 단위는 twip(1440 twip = 1인치, 1mm ≈ 56.7 twip). */
export const PAGE_MARGIN = { top: 907, bottom: 907, left: 1021, right: 1021 };
export const CONTENT_WIDTH = 9865; // 174mm

/** Word 기본 한글 글꼴. 맥·윈도 양쪽에서 안전한 조합. */
export const FONT = { ascii: "Arial", eastAsia: "맑은 고딕", hAnsi: "Arial" };
/** 코드에만 쓰는 고정폭. 없는 컴퓨터에서는 Word가 알아서 대체한다. */
export const MONO = { ascii: "Consolas", eastAsia: "D2Coding", hAnsi: "Consolas" };

/* 화면과 같은 기준. 옅은 회색 글씨는 두지 않는다. */
export const INK = "14161A";
export const INK_2 = "24272C";
export const RULE = "DCDCE0";
export const LINK = "2F5BEA";
export const SHADE = "F4F4F6"; // 코드 바탕

/** 본문 크기(half-point). 19 = 9.5pt. */
export const BODY_SIZE = 19;

export type RunOptions = {
  size?: number;
  color?: string;
  bold?: boolean;
  italics?: boolean;
  strike?: boolean;
  underline?: boolean;
  /** 고정폭 글꼴로 찍는다. 코드 조각에만 쓴다. */
  mono?: boolean;
};

export function text(d: Docx, value: string, options: RunOptions = {}) {
  return new d.TextRun({
    text: value,
    font: options.mono ? MONO : FONT,
    size: options.size ?? BODY_SIZE,
    color: options.color ?? INK_2,
    bold: options.bold ?? false,
    italics: options.italics ?? false,
    strike: options.strike ?? false,
    underline: options.underline === true ? {} : undefined,
  });
}

/**
 * 눌러서 갈 수 있는 링크.
 * 이 문서는 사이트 밖에서 열리므로 경로가 아니라 절대 주소여야 한다.
 */
export function hyperlink(d: Docx, label: string, url: string, size = BODY_SIZE) {
  return new d.ExternalHyperlink({
    children: [text(d, label, { size, color: LINK, underline: true })],
    link: url,
  });
}
