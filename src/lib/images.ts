/**
 * 글에 넣는 그림.
 *
 * 파일은 src/content/posts/images/ 아래에 두고, 마크다운에는 그 디렉터리를
 * 기준으로 한 경로만 적는다. 예) ![측정 결과](aimd/throughput.png)
 * 번들러가 해시 붙은 주소로 바꿔 주므로 base 경로를 손으로 적을 일이 없다.
 */

const IMAGE_DIR = "../content/posts/images/";

const imageFiles = import.meta.glob("../content/posts/images/**/*.{png,jpg,jpeg,gif,svg,webp,avif}", {
  query: "?url",
  import: "default",
  eager: true,
}) as Record<string, string>;

/** "aimd/throughput.png" → 번들된 주소 */
const urls = new Map(
  Object.entries(imageFiles).map(([path, url]) => [path.slice(IMAGE_DIR.length), url]),
);

const EXTERNAL = /^(?:https?:)?\/\/|^data:/;
const FENCE = /```[\s\S]*?```|`[^`\n]*`/g;
const IMAGE_REF = /!\[[^\]]*\]\(\s*([^)\s]+)/g;

/** 마크다운에 적힌 경로를 map의 열쇠 모양으로 맞춘다. */
function normalize(src: string): string {
  return src.replace(/^\.?\//, "");
}

/** 바깥 주소는 그대로 두고, 안에 있는 파일은 번들된 주소로 바꾼다. */
export function resolveImage(src: string): string | undefined {
  if (EXTERNAL.test(src)) return src;
  return urls.get(normalize(src));
}

/**
 * 본문이 가리키는 그림이 실제로 있는지 확인한다.
 * 오타 하나로 빈 네모가 뜨는 대신 어느 글의 어느 경로가 틀렸는지 바로 알려 준다.
 */
export function assertImages(body: string, source: string): void {
  const prose = body.replace(FENCE, "");

  for (const [, src] of prose.matchAll(IMAGE_REF)) {
    if (resolveImage(src) !== undefined) continue;
    throw new Error(
      `${source}: 그림 "${src}"를 찾을 수 없습니다. ` +
        `src/content/posts/images/${normalize(src)} 에 파일을 두거나 경로를 고치세요.`,
    );
  }
}
