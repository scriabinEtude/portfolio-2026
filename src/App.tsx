import {
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  Github,
  Mail,
  Network,
  Sparkles,
} from "lucide-react";
import {
  experiences,
  focusKeywords,
  navigation,
  profile,
  projects,
  strengths,
  techStack,
} from "./data/portfolioData";

const iconMap = [Code2, BriefcaseBusiness, Network, Sparkles];

function App() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#home" aria-label="홈으로 이동">
          <span className="brand-mark">YN</span>
          <span>{profile.name}</span>
        </a>
        <nav className="site-nav" aria-label="주요 메뉴">
          {navigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <main>
        <section className="hero section" id="home">
          <div className="hero-content">
            <p className="eyebrow">백엔드 중심 제품 엔지니어</p>
            <h1>{profile.role}</h1>
            <p className="hero-lead">{profile.headline}</p>
            <p className="hero-copy">{profile.intro}</p>
            <div className="hero-actions" aria-label="프로필 링크">
              <a className="button primary" href={`mailto:${profile.email}`}>
                <Mail size={18} aria-hidden="true" />
                이메일
              </a>
              <a className="button" href={profile.github} target="_blank" rel="noreferrer">
                <Github size={18} aria-hidden="true" />
                GitHub
              </a>
              <a className="button" href={profile.resume} target="_blank" rel="noreferrer">
                <ArrowUpRight size={18} aria-hidden="true" />
                이력서
              </a>
            </div>
          </div>

          <div className="system-board" aria-label="역량 요약">
            <div className="board-topline">
              <span>제품 과제</span>
              <span>실제 동작 시스템</span>
            </div>
            <div className="board-flow">
              {focusKeywords.map((keyword, index) => {
                const Icon = iconMap[index];
                return (
                  <div className="flow-node" key={keyword}>
                    <Icon size={22} aria-hidden="true" />
                    <span>{keyword}</span>
                  </div>
                );
              })}
            </div>
            <div className="board-metrics">
              <div>
                <strong>4</strong>
                <span>주요 프로젝트</span>
              </div>
              <div>
                <strong>AI</strong>
                <span>RAG·자동화</span>
              </div>
              <div>
                <strong>BE</strong>
                <span>아키텍처 우선</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section intro-strip" aria-label="핵심 정체성">
          <p>
            복잡한 거래/결제/예약 상태를 안정적인 백엔드 구조로 설계하고, 수기 운영 업무를
            API·백오피스·외부 연동으로 자동화하며, 반복 질문과 문서 탐색 문제를 RAG/AI
            시스템으로 줄여왔습니다.
          </p>
        </section>

        <section className="section" id="projects">
          <div className="section-heading">
            <p className="eyebrow">주요 프로젝트</p>
            <h2>문제 정의부터 운영 적용까지 연결한 프로젝트</h2>
          </div>
          <div className="project-list">
            {projects.map((project, index) => (
              <article className="project-card" key={project.title}>
                <div className="project-index">{String(index + 1).padStart(2, "0")}</div>
                <div className="project-body">
                  <p className="project-category">{project.category}</p>
                  <h3>{project.title}</h3>
                  <p className="project-position">{project.position}</p>
                  <p>{project.summary}</p>
                  <ul>
                    {project.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                  <div className="tag-row">
                    {project.stack.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="strengths">
          <div className="section-heading">
            <p className="eyebrow">강점</p>
            <h2>백엔드 정체성을 중심으로 확장되는 강점</h2>
          </div>
          <div className="strength-grid">
            {strengths.map((strength, index) => {
              const Icon = iconMap[index];
              return (
                <article className="strength-card" key={strength.title}>
                  <div className="strength-icon">
                    <Icon size={22} aria-hidden="true" />
                  </div>
                  <h3>{strength.title}</h3>
                  <p>{strength.summary}</p>
                  <ul>
                    {strength.evidence.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </section>

        <section className="section timeline-section" id="experience">
          <div className="section-heading">
            <p className="eyebrow">경력</p>
            <h2>도메인은 달라도 일관되게 쌓아온 문제 해결 방식</h2>
          </div>
          <div className="timeline">
            {experiences.map((experience) => (
              <article className="timeline-item" key={`${experience.company}-${experience.period}`}>
                <div className="timeline-period">{experience.period}</div>
                <div>
                  <h3>{experience.company}</h3>
                  <p className="timeline-role">{experience.role}</p>
                  <p>{experience.description}</p>
                  <div className="tag-row compact">
                    {experience.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section tech-section" id="tech-stack">
          <div className="section-heading">
            <p className="eyebrow">기술 스택</p>
            <h2>제품과 운영 시스템을 만들기 위해 사용해온 도구들</h2>
          </div>
          <div className="tech-grid">
            {techStack.map((stack) => (
              <article className="tech-group" key={stack.group}>
                <h3>{stack.group}</h3>
                <div className="tag-row">
                  {stack.items.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section contact-section" id="contact">
          <div>
            <p className="eyebrow">연락</p>
            <h2>실제로 작동하는 제품 시스템을 함께 만들고 싶습니다.</h2>
            <p>
              공개 가능한 이름, 이메일, GitHub, 이력서 링크를 채우면 바로 지원용 포트폴리오로
              사용할 수 있습니다.
            </p>
          </div>
          <div className="contact-actions">
            <a className="button primary" href={`mailto:${profile.email}`}>
              <Mail size={18} aria-hidden="true" />
              {profile.email}
            </a>
            <a className="button" href={profile.github} target="_blank" rel="noreferrer">
              <Github size={18} aria-hidden="true" />
              GitHub
            </a>
            <a className="button" href={profile.resume} target="_blank" rel="noreferrer">
              <ArrowUpRight size={18} aria-hidden="true" />
              이력서
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
