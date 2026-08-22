import { Suspense, lazy } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import Layout from "./components/Layout";
import NotFoundPage from "./pages/NotFoundPage";
import PortfolioPage from "./pages/PortfolioPage";
import ResumePage from "./pages/ResumePage";

// 마크다운 렌더러는 글 상세에서만 쓰므로 그때 불러온다.
const PostPage = lazy(() => import("./pages/PostPage"));

/** 예전 주소(/posts/:slug)로 들어온 링크를 새 주소로 넘긴다. */
function LegacyPostRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/portfolio/${slug}`} replace />;
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<ResumePage />} />
        <Route path="portfolio" element={<PortfolioPage />} />
        <Route
          path="portfolio/:slug"
          element={
            <Suspense fallback={<div className="sheet" aria-busy="true" />}>
              <PostPage />
            </Suspense>
          }
        />

        <Route path="posts/:slug" element={<LegacyPostRedirect />} />
        <Route path="docs/:slug" element={<Navigate to="/" replace />} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
