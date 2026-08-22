import type { Resume } from "../lib/types";

/**
 * 이력서 내용. 이 파일만 고치면 화면·인쇄본·DOCX가 함께 바뀐다.
 *
 * 소개(자기소개)를 넣고 싶으면 sections 맨 앞에 아래를 붙이면 된다.
 *   { kind: "prose", id: "intro", title: "소개", paragraphs: ["...", "..."] },
 */
export const resume: Resume = {
  updated: "2026-08-22",
  tagline: "개발팀이 쓰는 AI 인프라와 글로벌 호텔 예약 시스템을 만듭니다.",

  sections: [
    {
      kind: "records",
      id: "career",
      title: "경력",
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
              summary:
                "AX를 위한 AI 인프라 구축을 담당했습니다. 개발팀의 리소스를 AI가 활용할 수 있도록 코드베이스 검색, 로그 검색, DB 조회, 통계 조회 등 공통 MCP를 개발했고, 개발 과정과 의사결정을 기록하는 AI 워크스페이스 표준을 설계해 팀 내 지식베이스를 구축하고 그 검색 기능을 MCP 형태로 제공했습니다. 구축한 MCP는 Slack·Jira 기반 AI 봇에 연동되어 비개발 직군 문의에 답변하는 데 활용되었고, 팀 내 배포를 통해 개발팀 리소스 활용 격차를 해소했습니다.",
              achievements: [
                {
                  text: "MCP 개발",
                  items: [
                    "코드베이스 검색 — 40여 개 활성 레포 대상, SCIP·Code-Graph 기반 심볼 분석, AST 기반 코드 청킹과 BM25·Semantic 하이브리드 검색 지원",
                    "로그 검색 — OpenSearch, GlusterFS, Athena 검색 지원",
                    "DB 검색 및 그룹웨어 기능 등 다수 MCP 제작",
                  ],
                },
                "AI 워크스페이스 표준 설계 및 중앙 인덱싱 서버 방식의 지식베이스 파이프라인 구축",
                "OpenBao OIDC 지원으로 사내 MCP 접근 자격증명 관리 및 Audit 체계 구축",
              ],
            },
            {
              id: "hotel-booking",
              title: "글로벌 호텔 공급사 통합 예약 시스템 개발 및 운영",
              summary:
                "아고다 등 20여 개 호텔 공급사와 카카오, 현대이지웰 등 8개 이상의 제휴사를 연결하는 호텔 예약 시스템의 개발·운영 전반과 최적화를 담당했습니다. 요금 조회 요청마다 20여 개 공급사에서 fanout 방식으로 요금을 가져와 최저가를 연산해 응답하는 구조라, 단일 요청의 처리 비용이 커 응답 속도를 확보하는 것이 핵심 과제였습니다. 또한 공급사당 최대 250만 개에 달하는 호텔 콘텐츠를 운영 영향 없이 배치로 동기화하고, IDC 기반 140여 대 서버의 관제 체계를 구축해 시스템의 성능과 안정성을 개선했습니다.",
              achievements: [
                "AIMD 기반 유량 제어로 800만 건 API 통신 규모의 호텔 콘텐츠 배치를 약 2주에서 1주일 이내로 단축",
                "Kafka·S3(Parquet)·Athena 기반 응답 로깅 파이프라인 구축으로 요금 조회 병목 원인 규명",
                "공급사별 타임아웃 조정, 캐시 히트율 개선 등으로 요금 조회 응답 시간 개선",
                "140여 대 IDC 서버 실시간 관제 status 페이지 구축, OOM·Old Heap 이상·공격 트래픽 탐지 및 조치",
              ],
            },
          ],
        },

        {
          id: "heartspace",
          period: { from: "2025.02", to: "2026.04" },
          title: "하트스페이스",
          meta: "IT 혁신팀 · 팀장",
          summary:
            "약 10년간 오프라인과 수기 기록으로 운영되던 외국인 한국 체류·부동산 관리 사업의 디지털 전환을 리드했습니다. 정형화된 요구사항이 없는 상태에서 직접 비즈니스를 체험하며 필요한 기능을 도출하고, 시스템 구조 설계와 기능 정의부터 개발·배포까지 주도해 IT 서비스로 전환했습니다.",
          bullets: [
            "WhatsApp·Instagram·LINE 등 국가별로 다른 메신저를 통합 관리하는 CS 시스템 구축",
            "LangChain·Embedding 기반 RAG 시스템을 구축하고, 가격 질의와 상담 시간 외 문의를 처리하는 AI CS Agent 개발",
            "외국인 고객 관리 백오피스 및 내부 AI 지식베이스 구축",
          ],
        },

        {
          id: "epic",
          period: { from: "2023.07", to: "2024.11" },
          title: "에픽코퍼레이션",
          summary:
            "명품 중고 경매 플랫폼에서 실시간 경매 시스템과 중고 명품의 유통·정산 시스템을 개발했습니다. 경매, C2C, 위탁판매 등 복수의 거래 모델을 지원했으며, 사용자 행동 데이터에 기반해 개발하기 위한 분석 환경을 구축했습니다.",
          bullets: [
            "GraphQL 기반 실시간 경매 시스템 구축",
            "경매·C2C·위탁판매 거래 모델을 지원하는 유통·정산 시스템 개발",
            "Mixpanel·Amplitude·AppsFlyer 연동, 지표 대시보드 구축 및 KPI 리포트 자동화",
          ],
        },

        {
          id: "grat",
          period: { from: "2022.03", to: "2023.04" },
          title: "그랫",
          summary:
            "반려동물 택시 예약 및 원격 진료 상담 서비스를 개발했습니다. 차량 배차·예약 테이블 알고리즘과 운행 소요시간 산출 알고리즘을 설계해 특허 등록까지 완료했고, WebRTC 기반 1:1 비대면 진료 상담 기능을 개발했습니다.",
          bullets: [
            {
              text: "사용자 희망 시간 기반 펫택시 매칭 알고리즘 설계 및 특허 등록",
              items: [
                "「인공지능 및 빅데이터를 이용하여 사용자의 희망 시간에 펫택시를 매칭하는 방법, 장치, 및 프로그램」 등록 제10-2474990호",
              ],
            },
            "WebRTC 기반 1:1 비대면 진료 상담 서비스 개발",
          ],
        },

        {
          id: "elon-soft",
          period: { from: "2019.06", to: "2021.12" },
          title: "이엘온소프트",
          summary:
            "Java Spring 기반 AML(자금세탁방지)·금융 컴플라이언스 솔루션을 개발해 금융권 고객사 온프레미스 환경에 구축했습니다. 이상 거래 징후를 분석·통보하는 STR 시스템과 요주의 인물 검색(WLF) 엔진을 개발했습니다.",
          bullets: [
            "Lucene 기반 WLF 검색 엔진 구축 — 보유 요주의 인물 데이터 규모와 검색 품질 테스트 기준으로 경쟁사 대비 우위 확보",
            "이상 징후(STR) 분석 및 메일 통보 시스템 개발",
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
        { key: "프론트엔드", values: ["React", "Next.js", "Svelte", "Flutter"] },
        {
          key: "데이터베이스",
          values: ["MySQL", "PostgreSQL", "Redis", "Lucene", "OpenSearch"],
        },
        { key: "데이터·메시징", values: ["Kafka", "AWS S3", "Parquet", "Athena", "SQS"] },
        {
          key: "인프라",
          values: ["AWS ECS", "Jenkins", "GitHub Actions", "Vercel", "OpenBao", "IDC 서버 운영"],
        },
        {
          key: "AI",
          values: [
            "Claude Code",
            "Codex",
            "Cursor",
            "MCP",
            "LangChain",
            "RAG(Embedding)",
            "SCIP",
            "Code-Graph",
            "Tree-sitter",
          ],
        },
        {
          key: "분석·모니터링",
          values: [
            "Sentry",
            "Scouter",
            "Grafana",
            "Datadog",
            "GA",
            "Superset",
            "Mixpanel",
            "Amplitude",
            "AppsFlyer",
          ],
        },
        { key: "협업", values: ["Slack", "Jira", "Confluence", "Bitbucket"] },
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
