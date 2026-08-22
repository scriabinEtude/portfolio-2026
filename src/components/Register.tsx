import type { ReactNode } from "react";

/**
 * 레지스터 격자. 왼쪽 레일에는 기간·분류 같은 키가, 오른쪽에는 본문이 선다.
 * 이력서·글 목록·글 머리가 모두 이 격자를 공유한다.
 */
export function Register({ children }: { readonly children: ReactNode }) {
  return <div className="register">{children}</div>;
}

type HeadingProps = {
  readonly title: string;
  readonly id?: string;
  /** 제목 오른쪽 칸에 놓을 것. 필터 막대처럼. */
  readonly children?: ReactNode;
};

export function RegisterHeading({ title, id, children }: HeadingProps) {
  return (
    <div className="reg-line reg-line--heading">
      <h2 className="reg-key reg-heading" id={id}>
        {title}
      </h2>
      <div className="reg-cell">{children}</div>
    </div>
  );
}

type LineProps = {
  readonly rail?: ReactNode;
  readonly className?: string;
  readonly as?: "div" | "article";
  readonly children: ReactNode;
};

export function RegisterLine({ rail, className, as = "div", children }: LineProps) {
  const Tag = as;
  return (
    <Tag className={className ? `reg-line ${className}` : "reg-line"}>
      <div className="reg-key">{rail}</div>
      <div className="reg-cell">{children}</div>
    </Tag>
  );
}
