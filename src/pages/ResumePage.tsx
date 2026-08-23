import { Link } from "react-router-dom";
import profileUrl from "../assets/profile.jpg";
import ResumeSections from "../components/ResumeSections";
import { resume } from "../content/resume";
import { site } from "../lib/site";

function ResumePage() {
  return (
    <div className="page">
      <header className="hero">
        <div className="hero-body">
          <h1 className="hero-name">{site.name}</h1>
          <p className="hero-role">{site.role}</p>

          <dl className="hero-contacts">
            <dt>이메일</dt>
            <dd>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </dd>
            <dt>포트폴리오</dt>
            <dd>
              <Link to={site.portfolioPath}>{site.portfolioUrl}</Link>
            </dd>
          </dl>
        </div>

        <img
          className="hero-photo"
          src={profileUrl}
          alt={`${site.name} 프로필 사진`}
          width={440}
          height={440}
        />
      </header>

      <ResumeSections sections={resume.sections} asOf={resume.updated} />
    </div>
  );
}

export default ResumePage;
