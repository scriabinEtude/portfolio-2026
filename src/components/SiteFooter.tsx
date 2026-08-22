import { site } from "../lib/site";

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <span className="mono">
          {site.name} · {site.roleEn}
        </span>
        <div className="footer-links mono">
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href={site.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
