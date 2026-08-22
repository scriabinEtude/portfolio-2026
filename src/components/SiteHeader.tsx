import { Link, NavLink } from "react-router-dom";
import { nav, site } from "../lib/site";

function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link className="brand" to="/">
          {site.name}
          <span className="brand-role">{site.roleEn}</span>
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
      </div>
    </header>
  );
}

export default SiteHeader;
