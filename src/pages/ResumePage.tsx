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
          <p className="hero-role">{site.roleEn}</p>
          <p className="hero-lead">{resume.tagline}</p>

          <div className="hero-links">
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <a href={site.github} target="_blank" rel="noreferrer">
              {site.githubHandle}
            </a>
          </div>

          {import.meta.env.DEV && (
            <p className="dev-note">
              내용은 <code>src/content/resume.ts</code>에서 고칩니다. 이 안내는 개발 중에만
              보입니다.
            </p>
          )}
        </div>

        <img
          className="hero-photo"
          src={profileUrl}
          alt={`${site.name} 증명사진`}
          width={312}
          height={400}
        />
      </header>

      <ResumeSections sections={resume.sections} />
    </div>
  );
}

export default ResumePage;
