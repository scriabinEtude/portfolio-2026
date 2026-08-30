import { useSearchParams } from "react-router-dom";
import { type ResumeVariant, defaultVariant, findVariant, variants } from "../content/resumes";

/**
 * 지금 보고 있는 이력서 판. 주소(?v=)가 진실이라 새로 고치거나 링크를 줘도 같은 판이 열린다.
 * 기본판은 ?v= 없이 두어 기존 주소가 그대로 산다.
 */
export function useResumeVariant(): ResumeVariant {
  const [params] = useSearchParams();
  return findVariant(params.get("v"));
}

/** 이력서 판을 고르는 탭. 내려받기·인쇄는 고른 판을 따라간다. */
function ResumeTabs() {
  const [params, setParams] = useSearchParams();
  const active = findVariant(params.get("v"));

  const select = (variant: ResumeVariant) => {
    const next = new URLSearchParams(params);
    if (variant.id === defaultVariant.id) next.delete("v");
    else next.set("v", variant.id);
    setParams(next, { replace: true });
  };

  return (
    <div className="resume-tabs no-print">
      <div className="tablist" role="tablist" aria-label="이력서 판">
        {variants.map((variant) => {
          const selected = variant.id === active.id;
          return (
            <button
              key={variant.id}
              type="button"
              role="tab"
              aria-selected={selected}
              className={selected ? "tab is-active" : "tab"}
              onClick={() => select(variant)}
            >
              {variant.label}
            </button>
          );
        })}
      </div>
      <p className="tab-note">{active.note}</p>
    </div>
  );
}

export default ResumeTabs;
