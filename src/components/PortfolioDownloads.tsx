import { Suspense, lazy, useCallback, useState } from "react";
import { posts, today } from "../lib/content";
import { printDocument } from "../lib/export/print";
import { site } from "../lib/site";
import DownloadActions from "./DownloadActions";

// 인쇄용 판은 마크다운 렌더러를 통째로 쓴다. 누를 때만 불러온다.
const PortfolioBundle = lazy(() => import("./PortfolioBundle"));

/** Word로 옮기는 쪽은 마크다운 파서까지 끌고 온다. 이것도 누를 때만 불러온다. */
async function buildDocx(): Promise<Blob> {
  const { buildPostsDocx } = await import("../lib/export/posts-docx");
  return buildPostsDocx(posts);
}

/**
 * 포트폴리오 글 전체를 한 파일로 내려받는다.
 * PDF는 인쇄용 판을 잠깐 띄워 인쇄하고, DOCX는 글을 그대로 Word로 옮긴다.
 */
function PortfolioDownloads() {
  const [printing, setPrinting] = useState(false);
  // 파일 이름은 가장 최근 글의 달을 쓴다. 예) 임한결_포트폴리오_2026-06
  const filename = `${site.name}_포트폴리오_${(posts[0]?.date ?? today()).slice(0, 7)}`;

  const print = useCallback(async () => {
    await printDocument(filename);
    setPrinting(false);
  }, [filename]);

  if (posts.length === 0) return null;

  return (
    <>
      <DownloadActions
        subject="포트폴리오 전체"
        filename={filename}
        buildDocx={buildDocx}
        onPrint={() => setPrinting(true)}
        preparing={printing}
      />

      {printing && (
        <Suspense fallback={null}>
          <PortfolioBundle posts={posts} onReady={print} />
        </Suspense>
      )}
    </>
  );
}

export default PortfolioDownloads;
