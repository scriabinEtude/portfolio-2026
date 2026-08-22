import { Link, NavLink, useMatch } from "react-router-dom";
import { resume } from "../content/resume";
import { buildResumeDocx } from "../lib/export/resume-docx";
import { nav, site } from "../lib/site";
import DownloadActions from "./DownloadActions";

function SiteHeader() {
  // 내려받기가 있는 페이지는 지금은 이력서뿐이다.
  const onResume = useMatch("/") !== null;
  const filename = `${site.name}_이력서_${resume.updated.slice(0, 7)}`;

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

        {onResume && (
          <>
            <span className="header-sep" aria-hidden="true" />
            <DownloadActions filename={filename} buildDocx={() => buildResumeDocx(resume)} />
          </>
        )}
      </div>
    </header>
  );
}

export default SiteHeader;
