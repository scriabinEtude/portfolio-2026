import type { ResumeRecord, ResumeSection } from "../lib/types";
import { Register, RegisterHeading, RegisterLine } from "./Register";

function RecordRail({ record }: { readonly record: ResumeRecord }) {
  const { from, to, note } = record.key;
  return (
    <>
      {from && <span className="rail-line">{from}</span>}
      {to && <span className="rail-line">{to}</span>}
      {note && <span className="rail-line rail-note">{note}</span>}
    </>
  );
}

/* 항목이 재정렬되지 않는 고정 목록이므로 인덱스를 키로 쓴다.
   내용이 같은 줄이 겹칠 수 있어 문자열은 키로 쓸 수 없다. */
function RecordBody({ record }: { readonly record: ResumeRecord }) {
  const bullets = record.bullets ?? [];
  const results = record.results ?? [];
  const stack = record.stack ?? [];

  return (
    <>
      <h3 className="rec-title">{record.title}</h3>
      {record.meta && <p className="rec-meta">{record.meta}</p>}
      {record.summary && <p className="rec-summary">{record.summary}</p>}

      {bullets.length > 0 && (
        <ul className="rec-bullets rec-group">
          {bullets.map((bullet, index) => (
            <li key={index}>{bullet}</li>
          ))}
        </ul>
      )}

      {results.length > 0 && (
        <div className="rec-group">
          <p className="rec-group-title">결과</p>
          <ul className="rec-bullets rec-bullets--result">
            {results.map((result, index) => (
              <li key={index}>{result}</li>
            ))}
          </ul>
        </div>
      )}

      {stack.length > 0 && (
        <ul className="chips" aria-label="사용 기술">
          {stack.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </>
  );
}

function SectionBody({ section }: { readonly section: ResumeSection }) {
  switch (section.kind) {
    case "prose":
      return (
        <RegisterLine>
          <div className="prose-block">
            {section.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </RegisterLine>
      );

    case "records":
      return (
        <>
          {section.records.map((record) => (
            <RegisterLine key={record.id} as="article" rail={<RecordRail record={record} />}>
              <RecordBody record={record} />
            </RegisterLine>
          ))}
        </>
      );

    case "matrix":
      return (
        <>
          {section.rows.map((row) => (
            <RegisterLine key={row.key} rail={<span className="rail-line">{row.key}</span>}>
              <ul className="chips chips--flush">
                {row.values.map((value, index) => (
                  <li key={index}>{value}</li>
                ))}
              </ul>
            </RegisterLine>
          ))}
        </>
      );

    case "list":
      return (
        <RegisterLine>
          <ul className="rec-bullets">
            {section.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </RegisterLine>
      );
  }
}

type ResumeSectionsProps = {
  readonly sections: readonly ResumeSection[];
};

function ResumeSections({ sections }: ResumeSectionsProps) {
  return (
    <Register>
      {sections.map((section) => (
        <section className="reg-section" id={section.id} key={section.id}>
          <RegisterHeading title={section.title} />
          <SectionBody section={section} />
        </section>
      ))}
    </Register>
  );
}

export default ResumeSections;
