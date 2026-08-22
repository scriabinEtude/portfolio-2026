import { useEffect, useState } from "react";
import type { Heading } from "../lib/headings";

type TocProps = {
  readonly headings: readonly Heading[];
};

/** 넓은 화면에서만 본문 옆에 서는 목차. 지금 읽는 절을 표시한다. */
function Toc({ headings }: TocProps) {
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setCurrent(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -68% 0px", threshold: 0 },
    );

    for (const heading of headings) {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 3) return null;

  return (
    <aside className="toc">
      <nav aria-label="목차">
        <p className="toc-label">목차</p>
        <ol>
          {headings.map((heading) => (
            <li
              key={heading.id}
              className={heading.level === 3 ? "toc-item toc-item--sub" : "toc-item"}
            >
              <a
                href={`#${heading.id}`}
                className={current === heading.id ? "is-current" : undefined}
                aria-current={current === heading.id ? "true" : undefined}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  );
}

export default Toc;
