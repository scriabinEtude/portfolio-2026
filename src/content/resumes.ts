import type { Resume } from "../lib/types";
import { resume } from "./resume";
import { resumeNext } from "./resume-next";

/** 이력서 판. 화면에서 탭으로 견줘 보고 하나를 고른다. */
export type ResumeVariant = {
  /** 주소에 쓰는 값(?v=). 기본판은 주소에 아무것도 붙이지 않는다. */
  readonly id: string;
  /** 탭에 보이는 이름 */
  readonly label: string;
  /** 탭 아래 한 줄 설명 */
  readonly note: string;
  /** 내려받는 파일 이름에 붙는 꼬리표. 기본판은 붙이지 않는다. */
  readonly suffix?: string;
  readonly resume: Resume;
};

export const variants: readonly ResumeVariant[] = [
  {
    id: "current",
    label: "기존안",
    note: "지금 쓰고 있는 이력서. 회사별 요약과 성과 목록 중심.",
    resume,
  },
  {
    id: "next",
    label: "개편안",
    note: "랠릿 상위 이력서 구조를 적용한 초안. 경력을 문제 → 해결 → 성과로 쪼갰다.",
    suffix: "개편안",
    resume: resumeNext,
  },
];

export const defaultVariant = variants[0];

/** 주소의 ?v= 값으로 판을 고른다. 모르는 값이면 기본판. */
export function findVariant(id: string | null): ResumeVariant {
  return variants.find((variant) => variant.id === id) ?? defaultVariant;
}
