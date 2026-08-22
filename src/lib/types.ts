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

/** 왼쪽 레일에 서는 키. 기간이 없는 기록도 있어 note만 쓸 수 있다. */
export type RecordKey = {
  /** 예) "2023.04" */
  readonly from?: string;
  /** 예) "재직 중", "2026.02" */
  readonly to?: string;
  /** 기간 대신 또는 아래에 붙는 짧은 라벨. 예) "학사" */
  readonly note?: string;
};

export type ResumeRecord = {
  readonly id: string;
  readonly key: RecordKey;
  readonly title: string;
  /** 소속·역할·규모 한 줄. 예) "백엔드 개발자 · 팀 5명" */
  readonly meta?: string;
  readonly summary?: string;
  readonly bullets?: readonly string[];
  /** 지표로 말할 수 있는 결과. 레일 표식이 강조색으로 바뀐다. */
  readonly results?: readonly string[];
  readonly stack?: readonly string[];
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
      readonly kind: "matrix";
      readonly id: string;
      readonly title: string;
      readonly rows: readonly { readonly key: string; readonly values: readonly string[] }[];
    }
  | {
      readonly kind: "list";
      readonly id: string;
      readonly title: string;
      readonly items: readonly string[];
    };

export type Resume = {
  /** YYYY-MM-DD */
  readonly updated: string;
  readonly tagline: string;
  readonly sections: readonly ResumeSection[];
};
