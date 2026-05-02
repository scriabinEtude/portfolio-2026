export type Project = {
  title: string;
  category: string;
  summary: string;
  position: string;
  highlights: string[];
  stack: string[];
};

export type Strength = {
  title: string;
  summary: string;
  evidence: string[];
};

export type Experience = {
  period: string;
  company: string;
  role: string;
  description: string;
  tags: string[];
};

export const profile = {
  name: "임한결",
  role: "제품·자동화·AI 경험을 갖춘 백엔드 개발자",
  headline:
    "제품과 운영 문제를 이해하고, 백엔드·프론트엔드·자동화·AI를 연결해 실제로 작동하는 시스템을 만드는 개발자입니다.",
  intro:
    "저는 기능을 단순히 구현하는 것보다, 그 기능이 왜 필요한지와 실제 업무에서 어떻게 쓰이는지를 먼저 이해하려고 합니다. 백엔드를 중심으로 데이터 구조, API, 운영 도구, 프론트엔드, AI 자동화까지 연결하며 현업의 문제를 실제로 줄이는 시스템을 만들어왔습니다.",
  email: "your.email@example.com",
  github: "https://github.com/YOUR_ID",
  resume: "RESUME_LINK",
};

export const navigation = [
  { label: "홈", href: "#home" },
  { label: "프로젝트", href: "#projects" },
  { label: "강점", href: "#strengths" },
  { label: "경력", href: "#experience" },
  { label: "기술 스택", href: "#tech-stack" },
  { label: "연락", href: "#contact" },
];

export const focusKeywords = [
  "백엔드 아키텍처",
  "제품 실행",
  "운영 자동화",
  "AI / RAG 시스템",
];

export const projects: Project[] = [
  {
    title: "외국인 컨시어지 플랫폼 운영 자동화 시스템",
    category: "백엔드·제품·자동화",
    summary:
      "외국인 고객의 입주부터 퇴실까지 이어지는 운영 흐름을 관리하기 위해 백오피스와 백엔드 시스템을 구축했습니다. 부동산 데이터 조회, 일정 관리, 슬랙 알림, 은행 API 연동 등 기존 수기 업무를 시스템화하고 AWS ECS와 GitHub Actions 기반 블루/그린 배포 환경을 구성했습니다.",
    position: "운영 업무를 시스템화한 백엔드 중심 제품 개발 경험",
    highlights: [
      "NestJS 기반 백엔드 아키텍처와 부동산 데이터 조회 최적화",
      "캘린더, Slack, 은행 API 연동을 통한 반복 운영 업무 자동화",
      "AWS ECS 블루/그린 배포와 GitHub Actions 기반 배포 안정화",
      "Svelte 기반 백오피스 표준화와 AI 개발 환경 도입",
    ],
    stack: ["NestJS", "PostgreSQL", "TypeORM", "Svelte", "AWS ECS", "GitHub Actions"],
  },
  {
    title: "Hybrid RAG 기반 AI CS 응대 시스템",
    category: "AI 워크플로 시스템",
    summary:
      "고객들이 반복적으로 묻는 가격, 할인, 서비스 관련 질문을 자동화하기 위해 AI 지식 DB와 Hybrid RAG 검색 기능을 구축했습니다. 관리자가 상황별 톤앤매너 프롬프트를 직접 관리할 수 있도록 설계했고, LLM 응답 지연으로 인한 병목은 SQS 기반 비동기 구조로 분리했습니다.",
    position: "AI를 실제 운영 문제에 적용한 경험",
    highlights: [
      "Vector DB와 LangChain 기반 Hybrid RAG 검색 구조 설계",
      "운영자가 관리 가능한 AI 지식 DB와 프롬프트 관리 기능 구현",
      "AWS SQS 기반 비동기 처리로 LLM 응답 병목 완화",
      "다국적 메신저 API 추상화로 채널 확장 가능성 확보",
    ],
    stack: ["LangChain", "Vector DB", "RAG", "AWS SQS", "NestJS", "메신저 API"],
  },
  {
    title: "명품 중고 거래 및 결제 도메인 백엔드 시스템",
    category: "커머스 백엔드",
    summary:
      "경매, C2C 매칭, 위탁 판매 등 여러 비즈니스 모델을 지원하는 거래/결제 백엔드 시스템을 설계했습니다. 쿠폰과 포인트가 결합된 복합 결제 트랜잭션, 국내외 PG 연동, 실시간 경매 데이터 통신, 동시성 이슈 해결을 담당했습니다.",
    position: "복잡한 비즈니스 로직과 트랜잭션 처리 경험",
    highlights: [
      "경매, C2C 매칭, 위탁 판매를 아우르는 거래 상태 모델링",
      "쿠폰, 포인트, PG 결제가 결합된 복합 결제 트랜잭션 처리",
      "Hasura GraphQL Subscription 기반 실시간 입찰가 갱신",
      "AWS SQS를 활용한 동시성 이슈 완화와 처리 안정화",
    ],
    stack: ["NestJS", "PostgreSQL", "Hasura", "GraphQL", "AWS SQS", "PG API"],
  },
  {
    title: "펫택시 예약 및 위치 기반 운행 최적화 시스템",
    category: "예약·모빌리티",
    summary:
      "차량 가용성과 예상 운행 시간을 고려한 펫택시 예약 타임테이블을 설계하고, 운행 예상 시간 산출 알고리즘 개발을 통해 사내 특허 출원 및 등록에 기여했습니다. GPS 라이브러리를 서비스 환경에 맞게 경량화하고 Flutter MVVM 구조와 WebRTC 기반 비대면 진료 기능을 구현했습니다.",
    position: "예약/위치 기반 서비스와 알고리즘 개발 경험",
    highlights: [
      "시간대별 예약 타임테이블과 차량 가용성 계산 로직 설계",
      "운행 예상 시간 산출 알고리즘 개발 및 특허 등록 기여",
      "GPS 라이브러리 경량화와 위치 정확도 맞춤 설정",
      "Flutter MVVM 구조와 WebRTC 기반 비대면 진료 기능 구현",
    ],
    stack: ["Spring Boot", "Flutter", "WebRTC", "GPS", "예약 로직", "알고리즘"],
  },
];

export const strengths: Strength[] = [
  {
    title: "백엔드 아키텍처",
    summary:
      "백엔드를 단순 API 구현이 아니라 비즈니스 상태와 데이터 흐름을 안정적으로 모델링하는 일로 바라봅니다.",
    evidence: [
      "거래, 결제, 예약, 이력 관리처럼 상태 변화가 중요한 도메인 설계",
      "PostgreSQL, TypeORM, Spring Batch, SQS를 활용한 안정적인 처리 구조",
      "운영자가 실제로 조회하고 검증할 수 있는 데이터 흐름 구성",
    ],
  },
  {
    title: "제품 실행",
    summary:
      "프론트엔드와 백오피스까지 직접 구현하며 API가 실제 사용자와 운영자에게 어떻게 쓰이는지 고려합니다.",
    evidence: [
      "Svelte, Flutter, 백오피스 화면을 통해 제품 검증 속도 개선",
      "현업의 사용 흐름을 바탕으로 데이터 조회, 처리, 예외 케이스 설계",
      "복잡한 기능을 사용자와 운영자가 이해 가능한 화면 흐름으로 연결",
    ],
  },
  {
    title: "운영 자동화",
    summary:
      "반복되는 수기 업무를 그대로 두지 않고 외부 API, 알림, 배포, 백오피스 기능으로 줄여왔습니다.",
    evidence: [
      "Slack, 캘린더, 은행 API 연동으로 업무 흐름 자동화",
      "GitHub Actions와 블루/그린 배포를 통한 릴리즈 안정화",
      "운영 데이터 조회와 내보내기 기능으로 검증 비용 절감",
    ],
  },
  {
    title: "AI / RAG 시스템",
    summary:
      "AI 도구를 개인 생산성 보조에 그치지 않고 CS, 문서 검색, 리뷰, 커뮤니케이션 흐름에 통합하려고 시도합니다.",
    evidence: [
      "Hybrid RAG 기반 CS 응대 시스템과 지식 DB 구축",
      "GitHub Actions 리뷰 자동화와 Slack AI 멘션 분석 봇에 대한 관심과 실험",
      "LLM 응답 지연, 프롬프트 관리, 운영자 제어권까지 고려한 시스템 설계",
    ],
  },
];

export const experiences: Experience[] = [
  {
    period: "최근",
    company: "외국인 컨시어지 플랫폼",
    role: "백엔드 중심 제품 엔지니어",
    description:
      "NestJS 기반 백엔드, 백오피스, 외부 API 연동, 배포 자동화, AI 개발 환경을 연결해 운영 업무를 시스템화했습니다.",
    tags: ["NestJS", "Svelte", "AWS ECS", "자동화", "AI 워크플로"],
  },
  {
    period: "커머스",
    company: "명품 리세일·경매 서비스",
    role: "백엔드 개발자",
    description:
      "거래, 경매, 결제, 정산, 실시간 입찰, 동시성 처리 등 복잡한 커머스 도메인의 핵심 백엔드 로직을 구현했습니다.",
    tags: ["결제", "거래", "SQS", "GraphQL", "백오피스"],
  },
  {
    period: "모빌리티",
    company: "펫택시·헬스케어 서비스",
    role: "풀스택 개발자",
    description:
      "예약 타임테이블, 위치 기반 운행 최적화, WebRTC 비대면 진료, Flutter 앱 구조를 함께 다뤘습니다.",
    tags: ["예약", "GPS", "Flutter", "WebRTC", "알고리즘"],
  },
  {
    period: "이전",
    company: "금융 데이터·엔터프라이즈 시스템",
    role: "백엔드 개발자",
    description:
      "금융 AML 대용량 데이터 배치, 검색 엔진, Spring Batch, PL/SQL 경험을 통해 백엔드 기반기를 쌓았습니다.",
    tags: ["Spring Batch", "PL/SQL", "Lucene", "배치", "금융"],
  },
];

export const techStack = [
  {
    group: "백엔드",
    items: ["NestJS", "Spring Boot", "PostgreSQL", "TypeORM", "GraphQL", "REST API"],
  },
  {
    group: "인프라",
    items: ["AWS ECS", "AWS SQS", "GitHub Actions", "블루/그린 배포", "배치"],
  },
  {
    group: "프론트엔드·앱",
    items: ["Svelte", "React", "Flutter", "MVVM", "백오피스 UI"],
  },
  {
    group: "AI·자동화",
    items: ["LangChain", "Hybrid RAG", "Vector DB", "프롬프트 관리", "Slack AI"],
  },
];
