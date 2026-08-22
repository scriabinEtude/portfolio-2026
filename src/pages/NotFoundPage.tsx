import { Link } from "react-router-dom";

type NotFoundPageProps = {
  readonly message?: string;
};

function NotFoundPage({ message = "찾는 페이지가 없습니다." }: NotFoundPageProps) {
  return (
    <div className="sheet">
      <header className="masthead">
        <div className="masthead-top">
          <span className="eyebrow">404</span>
        </div>
        <h1 className="article-title">{message}</h1>
        <p className="masthead-lead">주소가 바뀌었거나 아직 올리지 않은 글일 수 있습니다.</p>
      </header>

      <p className="notfound-action">
        <Link className="back-link" to="/portfolio">
          ← 포트폴리오로
        </Link>
      </p>
    </div>
  );
}

export default NotFoundPage;
