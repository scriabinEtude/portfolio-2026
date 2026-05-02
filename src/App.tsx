import {
  BriefcaseBusiness,
  Code2,
  Github,
  Mail,
  Network,
  Phone,
  Sparkles,
} from "lucide-react";
import profilePhoto from "./assets/profile.png";
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
        <a className="brand" href="#top" aria-label="맨 위로 이동">
          <img
            className="brand-avatar"
            src={profilePhoto}
            alt=""
            width={38}
            height={38}
            decoding="async"
          />
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
        <section className="profile-identity" id="top" aria-label="인적 사항">
          <img
            className="profile-photo"
            src={profilePhoto}
            alt={`${profile.name} 프로필 사진`}
            width={240}
            height={240}
            decoding="async"
          />
          <div className="profile-identity-text">
            <h2 className="profile-identity-name">{profile.name}</h2>
            <p className="profile-identity-career">{profile.careerTitle}</p>
            <a
              className="profile-identity-phone"
              href={`tel:${profile.phone.replace(/-/g, "")}`}
            >
              <Phone size={18} aria-hidden="true" />
              {profile.phone}
            </a>
            <a
              className="profile-identity-phone"
              href={`mailto:${profile.email}`}
            >
              <Mail size={18} aria-hidden="true" />
              {profile.email}
            </a>
     
          </div>
        </section>

        <section className="hero section" id="home">
          <div className="hero-content">
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
            <h2>주요 프로젝트</h2>
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
            <h2>강점</h2>
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

        <section className="section tech-section" id="tech-stack">
          <div className="section-heading">
            <h2 >Tech Stack</h2>
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
            <h2>Contact</h2>
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
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
