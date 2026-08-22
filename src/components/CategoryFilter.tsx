type CategoryFilterProps = {
  readonly categories: readonly string[];
  /** null이면 전체 */
  readonly selected: string | null;
  readonly onSelect: (category: string | null) => void;
  readonly count: number;
};

function CategoryFilter({ categories, selected, onSelect, count }: CategoryFilterProps) {
  return (
    <div className="filter-bar">
      <button type="button" aria-pressed={selected === null} onClick={() => onSelect(null)}>
        전체
      </button>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          aria-pressed={selected === category}
          onClick={() => onSelect(category)}
        >
          {category}
        </button>
      ))}
      <span className="filter-count">{count}편</span>
    </div>
  );
}

export default CategoryFilter;
