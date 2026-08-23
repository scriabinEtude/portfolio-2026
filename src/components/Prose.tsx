import type { Element } from "hast";
import Markdown, { type Components } from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { resolveImage } from "../lib/images";

type ProseProps = {
  readonly children: string;
  /**
   * 그림을 미루지 않고 바로 받는다.
   * 화면에 없는(인쇄용) 판은 lazy로 두면 영영 뜨지 않는다.
   */
  readonly eager?: boolean;
};

/** 문단 안에 그림 하나뿐이면 그 그림을 돌려준다. 그때만 캡션을 붙인다. */
function loneImage(node: Element | undefined): Element | undefined {
  if (node === undefined) return undefined;

  const kids = node.children.filter(
    (child) => !(child.type === "text" && child.value.trim() === ""),
  );
  const only = kids.length === 1 ? kids[0] : undefined;

  return only?.type === "element" && only.tagName === "img" ? only : undefined;
}

function buildComponents(eager: boolean): Components {
  return {
    // node(hast 노드)는 DOM으로 흘러가면 안 되므로 여기서 떨궈 낸다.
    img({ node, src, alt, ...rest }) {
      const resolved = typeof src === "string" ? resolveImage(src) : undefined;
      return (
        <img
          {...rest}
          src={resolved ?? src}
          alt={alt ?? ""}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
        />
      );
    },

    // 그림만 있는 문단은 figure로 바꾸고 alt를 캡션으로 쓴다.
    p({ node, children, ...rest }) {
      const image = loneImage(node);
      if (image === undefined) return <p {...rest}>{children}</p>;

      const caption = image.properties?.alt;
      return (
        <figure>
          {children}
          {typeof caption === "string" && caption !== "" && <figcaption>{caption}</figcaption>}
        </figure>
      );
    },
  };
}

const lazyComponents = buildComponents(false);
const eagerComponents = buildComponents(true);

/** 마크다운 본문 렌더러. 표·체크리스트 등 GFM 문법과 제목 앵커를 지원한다. */
function Prose({ children, eager = false }: ProseProps) {
  return (
    <div className="prose">
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={eager ? eagerComponents : lazyComponents}
      >
        {children}
      </Markdown>
    </div>
  );
}

export default Prose;
