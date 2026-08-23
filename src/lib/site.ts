/** 사이트 전역 고정값. 이름·연락처는 여기만 고치면 된다. */
export const site = {
  name: "임한결",
  role: "백엔드 개발자",
  roleEn: "Backend Engineer",
  email: "scriabinetude87@gmail.com",
  github: "https://github.com/scriabinEtude",
  githubHandle: "github.com/scriabinEtude",
  /** 인쇄본·DOCX에서는 눌러서 갈 수 없으므로 주소를 그대로 보인다. */
  portfolioPath: "/portfolio",
  portfolioUrl: "scriabinetude.github.io/portfolio-2026/portfolio",
} as const;

export const nav = [
  { to: "/", label: "이력서", end: true },
  { to: "/portfolio", label: "포트폴리오", end: false },
] as const;
