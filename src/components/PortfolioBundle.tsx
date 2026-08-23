import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { formatDate, readingMinutes, today } from "../lib/content";
import { waitForAssets } from "../lib/export/print";
import { site } from "../lib/site";
import type { Post } from "../lib/types";
import Prose from "./Prose";

/** 이 클래스가 붙어 있는 동안에는 사이트 껍데기 대신 묶음 문서를 인쇄한다. */
const BODY_CLASS = "is-bundling";

type PortfolioBundleProps = {
  readonly posts: readonly Post[];
  /** 그림·글꼴까지 다 뜬 뒤에 부른다. 이때 인쇄를 열면 된다. */
  readonly onReady: () => void;
};

/**
 * 글 전체를 이어 붙인 인쇄용 판. 화면에는 나오지 않는다.
 * 표지·차례를 앞에 두고 글마다 새 쪽에서 시작한다.
 */
function PortfolioBundle({ posts, onReady }: PortfolioBundleProps) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.classList.add(BODY_CLASS);
    return () => document.body.classList.remove(BODY_CLASS);
  }, []);

  useEffect(() => {
    let alive = true;
    waitForAssets(root.current ?? document).then(() => {
      if (alive) onReady();
    });
    return () => {
      alive = false;
    };
  }, [onReady]);

  return createPortal(
    <div className="print-doc" ref={root}>
      <section className="bundle-cover">
        <p className="bundle-kicker">포트폴리오</p>
        <h1 className="bundle-name">
          {site.name} · {site.role}
        </h1>

        <ul className="bundle-contacts">
          <li>{site.email}</li>
          <li>{site.portfolioUrl}</li>
        </ul>

        <p className="bundle-stamp">
          {formatDate(today())} 기준 · 글 {posts.length}편
        </p>

        <nav className="bundle-index" aria-label="차례">
          <h2 className="bundle-index-label">차례</h2>
          <ol>
            {posts.map((post) => (
              <li key={post.slug}>
                <span>{post.title}</span>
                <span className="bundle-index-meta">
                  {formatDate(post.date)} · {post.category}
                </span>
              </li>
            ))}
          </ol>
        </nav>
      </section>

      {posts.map((post) => (
        <article className="bundle-post" key={post.slug}>
          <header className="article-head">
            <p className="article-meta">
              <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.category} ·{" "}
              {readingMinutes(post.body)}분
            </p>

            <h2 className="article-title">{post.title}</h2>
            <p className="article-lead">{post.summary}</p>

            {post.tags.length > 0 && (
              <ul className="article-tags">
                {post.tags.map((tag) => (
                  <li key={tag}>#{tag}</li>
                ))}
              </ul>
            )}
          </header>

          <Prose eager>{post.body}</Prose>
        </article>
      ))}
    </div>,
    document.body,
  );
}

export default PortfolioBundle;
