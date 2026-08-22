import { Fragment } from "react";
import { formatPeriod, joinValues, toBullet } from "../lib/resume";
import type { BulletInput, Fact, ResumeProject, ResumeRecord, ResumeSection } from "../lib/types";

/* 항목이 재정렬되지 않는 고정 목록이므로 인덱스를 키로 쓴다.
   내용이 같은 줄이 겹칠 수 있어 문자열은 키로 쓸 수 없다. */

function Points({ items }: { readonly items: readonly BulletInput[] }) {
  return (
    <ul className="points">
      {items.map(toBullet).map((bullet, index) => (
        <li key={index}>
          {bullet.text}
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

function Project({ project }: { readonly project: ResumeProject }) {
  const achievements = project.achievements ?? [];

  return (
    <article className="project">
      <h4 className="project-name">{project.title}</h4>
      {project.summary && <p className="project-desc">{project.summary}</p>}
      {achievements.length > 0 && (
        <>
          <p className="points-label">주요 성과</p>
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
};

function ResumeSections({ sections }: ResumeSectionsProps) {
  return (
    <>
      {sections.map((section) => (
        <section className="section" id={section.id} key={section.id}>
          <h2 className="section-title">{section.title}</h2>
          <SectionBody section={section} />
        </section>
      ))}
    </>
  );
}

export default ResumeSections;
