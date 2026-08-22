import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

function Layout() {
  const { pathname } = useLocation();

  // 페이지를 옮기면 항상 맨 위에서 시작한다.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="shell">
      <SiteHeader />
      <main className="main">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}

export default Layout;
