import { useSearchParams } from "react-router-dom";
import CategoryFilter from "../components/CategoryFilter";
import PostRow from "../components/PostRow";
import { filterByCategory, listCategories, posts } from "../lib/content";

const CATEGORY_PARAM = "category";

function PortfolioPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categories = listCategories(posts);

  // 주소에 남은 카테고리가 실제로 존재할 때만 인정한다.
  const requested = searchParams.get(CATEGORY_PARAM);
  const selected = requested !== null && categories.includes(requested) ? requested : null;
  const visible = filterByCategory(posts, selected);

  const selectCategory = (category: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (category === null) {
      next.delete(CATEGORY_PARAM);
    } else {
      next.set(CATEGORY_PARAM, category);
    }
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="page">
      <header className="hero">
        <h1 className="hero-title">포트폴리오</h1>
        <p className="hero-lead">
          Blog
        </p>
      </header>

      <section className="section">
        <h2 className="sr-only">글 목록</h2>
        <CategoryFilter
          categories={categories}
          selected={selected}
          onSelect={selectCategory}
          count={visible.length}
        />

        {visible.length === 0 ? (
          <p className="empty-note">아직 이 카테고리에 올린 글이 없습니다.</p>
        ) : (
          <ul className="post-list">
            {visible.map((post) => (
              <PostRow key={post.slug} post={post} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default PortfolioPage;
