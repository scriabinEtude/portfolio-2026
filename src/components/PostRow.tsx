import { Link } from "react-router-dom";
import { formatMonth, readingMinutes } from "../lib/content";
import type { Post } from "../lib/types";
import { RegisterLine } from "./Register";

type PostRowProps = {
  readonly post: Post;
};

function PostRow({ post }: PostRowProps) {
  const rail = (
    <>
      <span className="rail-line">{formatMonth(post.date)}</span>
      <span className="post-key-cat">{post.category}</span>
    </>
  );

  return (
    <RegisterLine as="article" className="post-row" rail={rail}>
      <h3 className="post-title">
        <Link to={`/portfolio/${post.slug}`}>{post.title}</Link>
      </h3>
      <p className="post-summary">{post.summary}</p>

      <div className="post-foot">
        {post.tags.length > 0 && (
          <ul className="chips chips--plain" aria-label="기술 태그">
            {post.tags.map((tag) => (
              <li key={tag}>#{tag}</li>
            ))}
          </ul>
        )}
        <span className="post-read">{readingMinutes(post.body)}분</span>
      </div>
    </RegisterLine>
  );
}

export default PostRow;
