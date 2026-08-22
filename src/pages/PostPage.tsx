import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import Prose from "../components/Prose";
import Toc from "../components/Toc";
import { findPost, formatDate, readingMinutes } from "../lib/content";
import { extractHeadings } from "../lib/headings";
import NotFoundPage from "./NotFoundPage";

function PostPage() {
  const { slug } = useParams();
  const post = findPost(slug);
  const headings = useMemo(() => extractHeadings(post?.body ?? ""), [post?.body]);

  if (!post) {
    return <NotFoundPage message="찾는 글이 없습니다." />;
  }

  return (
    <div className="doc-grid">
      <Toc headings={headings} />

      <article className="sheet">
        <Link className="back-link" to="/portfolio">
          ← 포트폴리오
        </Link>

        <header className="masthead">
          <div className="masthead-top">
            <span className="eyebrow">{post.category}</span>
            <span className="mono">
              <time dateTime={post.date}>{formatDate(post.date)}</time> · {readingMinutes(post.body)}
              분
            </span>
          </div>

          <h1 className="article-title">{post.title}</h1>
          <p className="masthead-lead">{post.summary}</p>

          {post.tags.length > 0 && (
            <ul className="chips chips--plain" aria-label="기술 태그">
              {post.tags.map((tag) => (
                <li key={tag}>#{tag}</li>
              ))}
            </ul>
          )}
        </header>

        <Prose>{post.body}</Prose>
      </article>
    </div>
  );
}

export default PostPage;
