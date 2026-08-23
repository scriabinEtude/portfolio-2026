import { resolveImage } from "../images";

/**
 * 글에 실린 그림을 Word에 넣을 수 있는 모양으로 읽는다.
 *
 * Word는 png·jpg·gif·bmp만 그대로 받는다. svg처럼 그 밖의 형식은 화면에 한 번
 * 그려서 png로 바꿔 넣는다. 못 읽은 그림은 null로 돌려주고, 부르는 쪽이 설명글로 대신한다.
 */

export type DocxImageType = "png" | "jpg" | "gif" | "bmp";

export type DocxImage = {
  readonly type: DocxImageType;
  readonly data: ArrayBuffer;
  /** 원본 크기(px). 지면 폭에 맞출 때 쓴다. */
  readonly width: number;
  readonly height: number;
};

/** Word가 그대로 받아 주는 형식. */
const NATIVE: Record<string, DocxImageType> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/gif": "gif",
  "image/bmp": "bmp",
};

/** svg를 png로 구울 때의 배율. 인쇄에서 흐려지지 않을 만큼만. */
const RASTER_SCALE = 2;
/** 크기를 알 수 없는 그림에 쓰는 기본값. */
const FALLBACK = { width: 960, height: 540 };

export async function loadDocxImage(src: string): Promise<DocxImage | null> {
  const url = resolveImage(src);
  if (url === undefined) return null;

  try {
    const [element, blob] = await Promise.all([loadElement(url), fetchBlob(url)]);
    const width = element.naturalWidth || FALLBACK.width;
    const height = element.naturalHeight || FALLBACK.height;

    const native = NATIVE[blob.type];
    if (native !== undefined) {
      return { type: native, data: await blob.arrayBuffer(), width, height };
    }

    return await rasterize(element, width, height);
  } catch {
    return null;
  }
}

function fetchBlob(url: string): Promise<Blob> {
  return fetch(url).then((response) => {
    if (!response.ok) throw new Error(`${response.status} ${url}`);
    return response.blob();
  });
}

function loadElement(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const element = new Image();
    element.onload = () => resolve(element);
    element.onerror = () => reject(new Error(`그림을 읽지 못했습니다: ${url}`));
    element.src = url;
  });
}

/** 화면에 한 번 그린 뒤 png 바이트로 꺼낸다. */
async function rasterize(
  element: HTMLImageElement,
  width: number,
  height: number,
): Promise<DocxImage | null> {
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * RASTER_SCALE);
  canvas.height = Math.round(height * RASTER_SCALE);

  const context = canvas.getContext("2d");
  if (context === null) return null;
  context.drawImage(element, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (blob === null) return null;

  return { type: "png", data: await blob.arrayBuffer(), width, height };
}
