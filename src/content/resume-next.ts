import type { Resume } from "../lib/types";

/**
 * 이력서 개편안. 랠릿 허브 상위 이력서를 조사해 뽑은 구조를 적용했다.
 *
 * 기존안(resume.ts)과의 차이:
 *  - 소개를 한 줄 정체성 + 숫자 + 관점으로 압축
 *  - 경력을 "문제 → 해결 → 성과" 라벨로 쪼개 각 줄이 이야기 하나가 되게 함
 *  - 오래된 경력일수록 압축
 *
 * ◻로 표시한 자리는 아직 측정하지 않은 값이다. 지어내지 않고 비워 뒀다.
 */
export const resumeNext: Resume = {
  updated: "2026-08-30",
  sections: [
    {
      kind: "prose",
      id: "intro",
      title: "소개",
      paragraphs: [
        "20여 개 글로벌 공급사를 연동하는 호텔 예약 시스템에서 응답 속도와 대용량 배치를 개선해온 백엔드 개발자입니다. 800만 건 규모 콘텐츠 동기화 배치를 유량 제어로 3주에서 1주로 줄이고 140여 대 IDC 서버의 실시간 관제 체계를 구축했습니다.",
        "지금은 AX 팀에서 코드베이스 검색·로그·DB 조회 MCP와 OIDC 인증 게이트를 만들어 전사에 제공하고 있습니다. AI를 각자 알아서 쓰는 도구가 아니라 조직이 함께 쓰는 기반으로 만드는 데 관심이 있습니다.",
      ],
    },

    {
      kind: "records",
      id: "career",
      title: "경력",
      showTotal: true,
      records: [
        {
          id: "tidesquare",
          period: { from: "2026.05", to: "재직 중" },
          title: "타이드스퀘어",
          meta: "AX Unit · 팀원",
          projects: [
            {
              id: "ai-infra",
              title: "개발팀 AI 인프라 및 지식베이스 구축",
              achievements: [
                {
                  label: "문제",
                  text: "팀마다 AI 활용 수준이 제각각이고 사내 리소스(코드·로그·DB)에 접근하는 표준 경로와 자격증명 관리가 없어 확산이 막혀 있었습니다.",
                },
                {
                  label: "해결",
                  text: "활성 레포 40여 개를 대상으로 코드베이스 검색과 로그·DB 조회 MCP를 개발하고 OpenBao OIDC 인증 게이트로 개별 토큰 발급·감사 체계를 세웠습니다. AI 워크스페이스 표준과 중앙 인덱싱 지식베이스 파이프라인을 설계했습니다.",
                  items: [
                    "코드베이스 검색 — SCIP·Code-Graph 기반 심볼 분석, AST 청킹, BM25·시맨틱 하이브리드 검색",
                    "로그 검색 — OpenSearch, GlusterFS, Athena",
                  ],
                },
                {
                  label: "성과",
                  text: "로컬 하네스 플러그인, Slack·Jira 챗봇 등 다중 채널로 전사 배포 — 도입 팀 수·주간 활성 사용자·처리 질의 수 ◻",
                },
              ],
            },
            {
              id: "hotel-booking",
              title: "글로벌 호텔 공급사 통합 예약 시스템 개발·운영",
              achievements: [
                {
                  label: "문제",
                  text: "요금 조회마다 20여 개 공급사에 fanout 후 최저가를 연산하는 구조라 단일 요청 비용이 크고, 공급사당 최대 250만 개 콘텐츠 동기화가 운영과 API 한도를 공유해 배치가 3주씩 걸렸습니다.",
                },
                {
                  label: "해결",
                  text: "AIMD 기반 유량 제어로 배치가 남는 용량만큼 스스로 동시성을 조절하게 만들고 Kafka·S3(Parquet)·Athena 응답 로깅 파이프라인으로 조회 병목을 규명했습니다. 공급사별 타임아웃·캐시 히트율도 조정했습니다.",
                  href: "/portfolio/batch-congestion-control",
                },
                {
                  label: "성과",
                  text: "800만 건 API 배치 3주 → 1주. 140여 대 IDC 서버 실시간 관제 페이지를 만들어 OOM·힙 이상·공격 트래픽을 탐지·조치. 요금 조회 응답 시간 ◻ms → ◻ms",
                },
              ],
            },
          ],
        },

        {
          id: "heartspace",
          period: { from: "2025.02", to: "2026.04" },
          title: "하트스페이스",
          meta: "IT 혁신팀 · 팀장",
          bullets: [
            {
              label: "문제",
              text: "외국인 체류·부동산 관리 사업이 10년간 오프라인 수기 기록으로 운영되어 정형화된 요구사항 자체가 없는 상태였습니다.",
            },
            {
              label: "해결",
              text: "비즈니스를 직접 체험하며 기능을 도출하고 시스템 설계부터 배포까지 리드했습니다. WhatsApp·Instagram·LINE 통합 CS 시스템과 LangChain·임베딩 RAG 기반 AI CS Agent를 만들어 가격 질의와 상담 시간 외 문의를 처리했습니다.",
              href: "/portfolio/langchain-cs-agent",
            },
            {
              label: "성과",
              text: "상담 시간 외 문의 자동 처리 비율·응답 시간 개선 ◻",
            },
          ],
        },

        {
          id: "epic",
          period: { from: "2023.07", to: "2024.11" },
          title: "에픽코퍼레이션",
          bullets: [
            "명품 중고 경매 플랫폼에서 GraphQL 기반 실시간 경매 시스템과 경매·C2C·위탁판매를 지원하는 유통·정산 시스템 개발",
            "Mixpanel·Amplitude·AppsFlyer 연동, 지표 대시보드 구축 및 KPI 리포트 자동화",
          ],
        },

        {
          id: "grat",
          period: { from: "2022.03", to: "2023.04" },
          title: "그랫",
          bullets: [
            {
              text: "펫택시 매칭 알고리즘 설계 및 특허 등록 — 「인공지능 및 빅데이터를 이용하여 사용자의 희망 시간에 펫택시를 매칭하는 방법, 장치, 및 프로그램」 등록 제10-2474990호",
            },
            "WebRTC 기반 1:1 비대면 진료 상담 서비스 개발",
          ],
        },

        {
          id: "elon-soft",
          period: { from: "2019.06", to: "2021.12" },
          title: "이엘온소프트",
          bullets: [
            "AML 금융 컴플라이언스 솔루션을 금융권 온프레미스 환경에 구축. Lucene 기반 요주의 인물 검색(WLF) 엔진을 만들어 데이터 규모·검색 품질 테스트 기준 경쟁사 대비 우위 확보",
          ],
        },
      ],
    },

    {
      kind: "rows",
      id: "skills",
      title: "기술",
      rows: [
        { key: "백엔드", values: ["Java", "Spring Boot", "NestJS", "GraphQL", "WebRTC"] },
        { key: "데이터·메시징", values: ["Kafka", "AWS S3", "Parquet", "Athena", "SQS"] },
        {
          key: "데이터베이스",
          values: ["MySQL", "PostgreSQL", "Redis", "Lucene", "OpenSearch"],
        },
        {
          key: "AI",
          values: ["MCP", "LangChain", "RAG(Embedding)", "SCIP", "Code-Graph", "Tree-sitter"],
        },
        {
          key: "인프라",
          values: ["AWS ECS", "Jenkins", "GitHub Actions", "OpenBao", "IDC 서버 운영"],
        },
        { key: "프론트엔드", values: ["React", "Next.js", "Svelte", "Flutter"] },
      ],
    },

    {
      kind: "facts",
      id: "background",
      title: "학력 · 자격 · 병역",
      facts: [
        {
          id: "edu-credit-bank",
          label: "학력",
          title: "학점은행제",
          detail: "컴퓨터공학 졸업 예정",
          when: "2027.02",
        },
        {
          id: "edu-myongji",
          title: "명지대학교",
          detail: "국어국문학과 중퇴",
          when: "2013.03 — 2014.01",
        },
        { id: "cert-engineer", label: "자격", title: "정보처리기사", when: "2021.11" },
        { id: "cert-network", title: "네트워크관리사 2급", when: "2022.01" },
        {
          id: "military",
          label: "병역",
          title: "병장 만기 전역",
          when: "2014.01 — 2015.10",
        },
      ],
    },
  ],
};
