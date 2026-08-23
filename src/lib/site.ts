/** 사이트 전역 고정값. 이름·연락처는 여기만 고치면 된다. */
export const site = {
  name: "임한결",
  role: "백엔드 개발자",
  roleEn: "Backend Engineer",
  email: "scriabinetude87@gmail.com",
  github: "https://github.com/scriabinEtude",
  githubHandle: "github.com/scriabinEtude",
  /** 화면에서는 주소를 그대로 보이고, 눌러서 갈 수 있게 둔다. */
  portfolioPath: "/portfolio",
  portfolioUrl: "scriabinetude.github.io/portfolio-2026/portfolio",
  /** DOCX처럼 사이트 밖으로 나가는 문서의 링크는 절대 주소여야 한다. */
  origin: "https://scriabinetude.github.io/portfolio-2026",
} as const;

/** 사이트 안의 경로를 문서에 실을 수 있는 절대 주소로. */
export function absoluteUrl(path: string): string {
  return `${site.origin}${path}`;
}

export const nav = [
  { to: "/", label: "이력서", end: true },
  { to: "/portfolio", label: "포트폴리오", end: false },
] as const;
