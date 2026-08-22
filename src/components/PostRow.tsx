import { Link } from "react-router-dom";
import { formatDate, readingMinutes } from "../lib/content";
import type { Post } from "../lib/types";

type PostRowProps = {
  readonly post: Post;
};

function PostRow({ post }: PostRowProps) {
  return (
    <li className="post">
      <Link className="post-link" to={`/portfolio/${post.slug}`}>
        <p className="post-meta">
          <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.category} ·{" "}
          {readingMinutes(post.body)}분
        </p>
        <h3 className="post-title">{post.title}</h3>
        <p className="post-summary">{post.summary}</p>
        {post.tags.length > 0 && (
          <ul className="post-tags" aria-label="기술 태그">
            {post.tags.map((tag) => (
              <li key={tag}>#{tag}</li>
            ))}
          </ul>
        )}
      </Link>
    </li>
  );
}

export default PostRow;
