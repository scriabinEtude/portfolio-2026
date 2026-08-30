import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { formatMonths, formatPeriod, joinValues, toBullet, totalMonths } from "../lib/resume";
import { absoluteUrl } from "../lib/site";
import type {
  BulletInput,
  Claim,
  Fact,
  ResumeProject,
  ResumeRecord,
  ResumeSection,
} from "../lib/types";

/* 항목이 재정렬되지 않는 고정 목록이므로 인덱스를 키로 쓴다.
   내용이 같은 줄이 겹칠 수 있어 문자열은 키로 쓸 수 없다. */

/**
 * 성과 한 줄을 풀어 쓴 글로 보내는 링크.
 *
 * 주소는 절대 주소로 둔다. PDF로 인쇄하면 이 주소가 그대로 링크로 박히는데,
 * 상대 경로면 인쇄한 곳이 localhost일 때 localhost가 박혀 나간다.
 * 대신 그냥 누를 때는 새로 고치지 않고 화면 안에서 옮겨 간다.
 */
function PointLink({ href }: { readonly href: string }) {
  const navigate = useNavigate();

  return (
    <a
      className="point-link"
      href={absoluteUrl(href)}
      onClick={(event) => {
        // 새 탭으로 여는 조작은 브라우저에게 맡긴다.
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
        event.preventDefault();
        navigate(href);
      }}
    >
      글 보기 →
    </a>
  );
}

function Points({ items }: { readonly items: readonly BulletInput[] }) {
  return (
    <ul className="points">
      {items.map(toBullet).map((bullet, index) => (
        <li key={index}>
          {bullet.label && <b className="point-label">{bullet.label}</b>}
          {bullet.text}
          {bullet.href && <PointLink href={bullet.href} />}
          {bullet.items && bullet.items.length > 0 && (
            <ul className="points-sub">
              {bullet.items.map((item, itemIndex) => (
                <li key={itemIndex}>{item}</li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

function Claims({ claims }: { readonly claims: readonly Claim[] }) {
  return (
    <ul className="points points--claims">
      {claims.map((claim) => (
        <li key={claim.id}>
          <strong className="claim-lead">{claim.lead}</strong> {claim.body}
        </li>
      ))}
    </ul>
  );
}

function Project({ project }: { readonly project: ResumeProject }) {
  const achievements = project.achievements ?? [];
  // 줄마다 제 말머리(문제·해결·성과)를 달고 있으면 "주요 성과"로 묶는 게 맞지 않는다.
  const labelled = achievements.map(toBullet).some((bullet) => bullet.label !== undefined);

  return (
    <article className="project">
      <h4 className="project-name">{project.title}</h4>
      {project.summary && <p className="project-desc">{project.summary}</p>}
      {achievements.length > 0 && (
        <>
          {!labelled && <p className="points-label">주요 성과</p>}
          <Points items={achievements} />
        </>
      )}
    </article>
  );
}

function Job({ record }: { readonly record: ResumeRecord }) {
  const bullets = record.bullets ?? [];
  const projects = record.projects ?? [];

  return (
    <article className="job">
      <div className="job-head">
        <h3 className="job-name">{record.title}</h3>
        <span className="job-when">{formatPeriod(record.period)}</span>
      </div>
      {record.meta && <p className="job-role">{record.meta}</p>}
      {record.summary && <p className="job-desc">{record.summary}</p>}

      {bullets.length > 0 && <Points items={bullets} />}

      {projects.length > 0 && (
        <div className="projects">
          {projects.map((project) => (
            <Project key={project.id} project={project} />
          ))}
        </div>
      )}
    </article>
  );
}

function FactRow({ fact }: { readonly fact: Fact }) {
  return (
    <>
      <span className="fact-key">{fact.label ?? ""}</span>
      <span className="fact-value">
        {fact.detail ? <strong>{fact.title}</strong> : fact.title}
        {fact.detail && ` ${fact.detail}`}
      </span>
      <span className="fact-when">{fact.when ?? ""}</span>
    </>
  );
}

function SectionBody({ section }: { readonly section: ResumeSection }) {
  switch (section.kind) {
    case "prose":
      return (
        <div className="prose-block">
          {section.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      );

    case "claims":
      return <Claims claims={section.claims} />;

    case "records":
      return (
        <>
          {section.records.map((record) => (
            <Job key={record.id} record={record} />
          ))}
        </>
      );

    case "rows":
      return (
        <dl className="rows">
          {section.rows.map((row) => (
            <Fragment key={row.key}>
              <dt>{row.key}</dt>
              <dd>{joinValues(row.values)}</dd>
            </Fragment>
          ))}
        </dl>
      );

    case "facts":
      return (
        <div className="facts">
          {section.facts.map((fact) => (
            <FactRow key={fact.id} fact={fact} />
          ))}
        </div>
      );
  }
}

type ResumeSectionsProps = {
  readonly sections: readonly ResumeSection[];
  /** 총 재직 기간을 셀 기준 시점. YYYY-MM-DD */
  readonly asOf: string;
};

function ResumeSections({ sections, asOf }: ResumeSectionsProps) {
  return (
    <>
      {sections.map((section) => {
        const total =
          section.kind === "records" && section.showTotal
            ? formatMonths(totalMonths(section.records, asOf))
            : null;

        return (
          <section className="section" id={section.id} key={section.id}>
            <h2 className="section-title">
              {section.title}
              {total && <span className="section-total">총 {total}</span>}
            </h2>
            <SectionBody section={section} />
          </section>
        );
      })}
    </>
  );
}

export default ResumeSections;
