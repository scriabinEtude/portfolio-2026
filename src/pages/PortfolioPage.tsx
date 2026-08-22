import { useSearchParams } from "react-router-dom";
import CategoryFilter from "../components/CategoryFilter";
import PostRow from "../components/PostRow";
import { Register, RegisterHeading, RegisterLine } from "../components/Register";
import { filterByCategory, formatMonth, listCategories, posts } from "../lib/content";

const CATEGORY_PARAM = "category";

function PortfolioPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categories = listCategories(posts);
  const latest = posts[0];

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
    <div className="sheet">
      <header className="masthead">
        <div className="masthead-top">
          <span className="eyebrow">포트폴리오</span>
          {latest && <span className="mono">최근 글 {formatMonth(latest.date)}</span>}
        </div>
        <h1 className="masthead-title">만든 것과 그때 내린 판단</h1>
        <p className="masthead-lead">
          맡았던 프로젝트를 문제 정의부터 구조 결정, 남은 과제까지 한 편씩 정리합니다.
        </p>
      </header>

      <Register>
        <section className="reg-section">
          <RegisterHeading title="글">
            <CategoryFilter
              categories={categories}
              selected={selected}
              onSelect={selectCategory}
              count={visible.length}
            />
          </RegisterHeading>

          {visible.length === 0 ? (
            <RegisterLine>
              <p className="empty-note">아직 이 카테고리에 올린 글이 없습니다.</p>
            </RegisterLine>
          ) : (
            visible.map((post) => <PostRow key={post.slug} post={post} />)
          )}
        </section>
      </Register>
    </div>
  );
}

export default PortfolioPage;
