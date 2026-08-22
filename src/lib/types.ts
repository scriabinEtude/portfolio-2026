/* ── 포트폴리오 글 ─────────────────────────────────────── */

/** 목록에 필요한 글 정보. 본문은 제외. */
export type PostMeta = {
  readonly slug: string;
  readonly title: string;
  /** YYYY-MM-DD */
  readonly date: string;
  readonly category: string;
  readonly summary: string;
  readonly tags: readonly string[];
};

export type Post = PostMeta & {
  readonly body: string;
};

/* ── 이력서 ────────────────────────────────────────────────
   이력서는 산문이 아니라 기록의 묶음이다. 구조를 그대로 타입으로 두면
   화면·인쇄·DOCX 세 가지 출력이 같은 뼈대를 공유할 수 있다. */

/** 하위 항목을 거느릴 수 있는 글머리. 문자열만 주면 하위 항목이 없는 줄이다. */
export type Bullet = {
  readonly text: string;
  readonly items?: readonly string[];
};

export type BulletInput = string | Bullet;

export type Period = {
  /** 예) "2026.05" */
  readonly from: string;
  /** 예) "재직 중", "2026.04". 없으면 한 시점만 표시한다. */
  readonly to?: string;
};

/** 한 회사 안에서 따로 이름 붙은 프로젝트. */
export type ResumeProject = {
  readonly id: string;
  readonly title: string;
  readonly summary?: string;
  /** 주요 성과 */
  readonly achievements?: readonly BulletInput[];
};

/** 경력 한 건. */
export type ResumeRecord = {
  readonly id: string;
  readonly period: Period;
  readonly title: string;
  /** 소속·역할 한 줄. 예) "AX Unit · 팀원" */
  readonly meta?: string;
  readonly summary?: string;
  readonly bullets?: readonly BulletInput[];
  /** 회사 안에서 따로 떼어 쓸 만한 프로젝트가 있을 때만. */
  readonly projects?: readonly ResumeProject[];
};

/** 학력·자격·병역처럼 한 줄로 끝나는 사실. */
export type Fact = {
  readonly id: string;
  /** 바로 앞 항목과 같은 분류면 비워 둔다. 화면에서 묶여 보인다. */
  readonly label?: string;
  readonly title: string;
  readonly detail?: string;
  readonly when?: string;
};

export type ResumeSection =
  | {
      readonly kind: "prose";
      readonly id: string;
      readonly title: string;
      readonly paragraphs: readonly string[];
    }
  | {
      readonly kind: "records";
      readonly id: string;
      readonly title: string;
      readonly records: readonly ResumeRecord[];
    }
  | {
      readonly kind: "rows";
      readonly id: string;
      readonly title: string;
      readonly rows: readonly { readonly key: string; readonly values: readonly string[] }[];
    }
  | {
      readonly kind: "facts";
      readonly id: string;
      readonly title: string;
      readonly facts: readonly Fact[];
    };

export type Resume = {
  /** YYYY-MM-DD */
  readonly updated: string;
  readonly tagline: string;
  readonly sections: readonly ResumeSection[];
};
