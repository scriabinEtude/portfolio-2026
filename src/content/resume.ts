import type { Resume } from "../lib/types";

/**
 * 이력서 내용. 이 파일만 고치면 화면·인쇄본·DOCX가 함께 바뀐다.
 * 아래 값은 형태를 잡아둔 자리표시자다. 실제 내용으로 바꿔 쓰면 된다.
 */
export const resume: Resume = {
  updated: "2026-08-22",
  tagline:
    "결제·예약처럼 상태가 여러 곳으로 갈라지는 흐름을 다시 그려서, 팀이 읽고 고칠 수 있는 구조로 만듭니다.",

  sections: [
    {
      kind: "prose",
      id: "intro",
      title: "소개",
      paragraphs: [
        "어떤 문제에 끌리는지 씁니다. 복잡하게 얽힌 상태와 흐름을 다시 그려 단순하게 만드는 일을 좋아한다면, 그 판단을 어디서 내렸는지까지 적으면 좋습니다.",
        "어떻게 일하는지 씁니다. 설계 전에 무엇을 확인하는지, 결정을 어떤 형태로 남기고 팀과 어떻게 맞추는지 적습니다.",
        "다음에 맡고 싶은 문제와 그 이유를 씁니다.",
      ],
    },

    {
      kind: "records",
      id: "career",
      title: "경력",
      records: [
        {
          id: "career-1",
          key: { from: "2023.04", to: "재직 중" },
          title: "회사명",
          meta: "백엔드 개발자 · 정규직",
          summary: "담당한 서비스와 그 안에서 맡은 역할을 한 줄로 씁니다.",
          bullets: [
            "맡은 과제와 직접 내린 기술 결정을 적습니다.",
            "함께 일한 규모와 협업 방식을 적습니다.",
          ],
          results: ["숫자로 말할 수 있는 변화를 적습니다."],
        },
        {
          id: "career-2",
          key: { from: "2021.09", to: "2023.03" },
          title: "회사명",
          meta: "서버 개발자",
          bullets: ["담당 업무를 적습니다.", "담당 업무를 적습니다."],
        },
      ],
    },

    {
      kind: "records",
      id: "projects",
      title: "프로젝트",
      records: [
        {
          id: "project-1",
          key: { from: "2026.01", to: "2026.06" },
          title: "프로젝트명",
          meta: "백엔드 개발 · 팀 5명",
          summary: "무엇을 해결하려던 프로젝트였는지 한 줄로 씁니다.",
          bullets: ["설계하거나 구현한 것을 적습니다.", "직접 내린 기술 결정과 근거를 적습니다."],
          results: ["지표로 말할 수 있는 변화를 적습니다."],
          stack: ["Kotlin", "Spring Boot", "MySQL"],
        },
        {
          id: "project-2",
          key: { from: "2025.05", to: "2025.11" },
          title: "프로젝트명",
          meta: "백엔드 개발",
          bullets: ["설계하거나 구현한 것을 적습니다."],
          stack: ["TypeScript", "NestJS", "PostgreSQL"],
        },
      ],
    },

    {
      kind: "matrix",
      id: "skills",
      title: "기술",
      rows: [
        { key: "언어", values: ["Kotlin", "TypeScript", "Python"] },
        { key: "백엔드", values: ["Spring Boot", "NestJS", "FastAPI"] },
        { key: "데이터", values: ["PostgreSQL", "MySQL", "Redis"] },
        { key: "인프라", values: ["AWS", "Docker", "GitHub Actions"] },
      ],
    },

    {
      kind: "records",
      id: "education",
      title: "학력",
      records: [
        {
          id: "edu-1",
          key: { from: "2015.03", to: "2021.02", note: "학사" },
          title: "학교명",
          meta: "전공",
        },
      ],
    },

    {
      kind: "list",
      id: "etc",
      title: "그 밖에",
      items: ["자격증", "수상", "발표·기고"],
    },
  ],
};
