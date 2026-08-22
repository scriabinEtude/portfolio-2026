import DownloadBar from "../components/DownloadBar";
import ResumeSections from "../components/ResumeSections";
import { resume } from "../content/resume";
import { formatDate } from "../lib/content";
import { buildResumeDocx } from "../lib/export/resume-docx";
import { site } from "../lib/site";

function ResumePage() {
  const filename = `${site.name}_이력서_${resume.updated.slice(0, 7)}`;

  return (
    <article className="sheet">
      <header className="masthead">
        <div className="masthead-top">
          <span className="eyebrow">이력서</span>
          <span className="mono">최종 수정 {formatDate(resume.updated)}</span>
        </div>

        <h1 className="masthead-name">{site.name}</h1>

        <p className="masthead-role">
          <span>{site.role}</span>
          <span className="masthead-role-en">{site.roleEn}</span>
        </p>

        <p className="masthead-lead">{resume.tagline}</p>

        <ul className="contact-row">
          <li>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </li>
          <li>
            <a href={site.github} target="_blank" rel="noreferrer">
              {site.githubHandle}
            </a>
          </li>
        </ul>

        <DownloadBar filename={filename} buildDocx={() => buildResumeDocx(resume)} />
      </header>

      {import.meta.env.DEV && (
        <p className="dev-note">
          내용은 <code>src/content/resume.ts</code>에서 고칩니다. 이 안내는 개발 중에만 보입니다.
        </p>
      )}

      <ResumeSections sections={resume.sections} />
    </article>
  );
}

export default ResumePage;
