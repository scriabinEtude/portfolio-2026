import Markdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

type ProseProps = {
  readonly children: string;
};

/** 마크다운 본문 렌더러. 표·체크리스트 등 GFM 문법과 제목 앵커를 지원한다. */
function Prose({ children }: ProseProps) {
  return (
    <div className="prose">
      <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>
        {children}
      </Markdown>
    </div>
  );
}

export default Prose;
