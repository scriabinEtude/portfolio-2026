import { Link } from "react-router-dom";

type NotFoundPageProps = {
  readonly message?: string;
};

function NotFoundPage({ message = "찾는 페이지가 없습니다." }: NotFoundPageProps) {
  return (
    <div className="page">
      <div className="notfound">
        <p className="article-meta">404</p>
        <h1 className="article-title">{message}</h1>
        <p className="article-lead">주소가 바뀌었거나 아직 올리지 않은 글일 수 있습니다.</p>
        <p className="notfound-action">
          <Link className="back-link" to="/portfolio">
            ← 포트폴리오로
          </Link>
        </p>
      </div>
    </div>
  );
}

export default NotFoundPage;
