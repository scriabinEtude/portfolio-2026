import { Link, NavLink, useMatch } from "react-router-dom";
import { posts } from "../lib/content";
import { buildResumeDocx } from "../lib/export/resume-docx";
import { nav, site } from "../lib/site";
import DownloadActions from "./DownloadActions";
import PortfolioDownloads from "./PortfolioDownloads";
import { useResumeVariant } from "./ResumeTabs";

/** 지금 화면에서 내려받을 수 있는 것. 이력서 한 부, 또는 글 전체 한 묶음. */
function useDownloads() {
  const onResume = useMatch("/") !== null;
  const onPortfolio = useMatch("/portfolio") !== null;
  // 이력서는 판이 여럿이다. 지금 보고 있는 판을 그대로 내려받는다.
  const { resume, suffix } = useResumeVariant();

  if (onResume) {
    const tail = suffix ? `_${suffix}` : "";
    return (
      <DownloadActions
        subject="이력서"
        filename={`${site.name}_이력서${tail}_${resume.updated.slice(0, 7)}`}
        buildDocx={() => buildResumeDocx(resume)}
      />
    );
  }

  if (onPortfolio && posts.length > 0) return <PortfolioDownloads />;

  return null;
}

function SiteHeader() {
  const downloads = useDownloads();

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link className="brand" to="/">
          {site.name}
        </Link>

        <nav className="site-nav" aria-label="주요 메뉴">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? "is-active" : undefined)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {downloads !== null && (
          <>
            <span className="header-sep" aria-hidden="true" />
            {downloads}
          </>
        )}
      </div>
    </header>
  );
}

export default SiteHeader;
