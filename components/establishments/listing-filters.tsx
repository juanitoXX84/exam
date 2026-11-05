import Link from "next/link";
import type { ReactNode } from "react";
import { PriceRange } from "@prisma/client";
import { PRICE_RANGE_LABELS, PRICE_RANGE_SHORT } from "@/lib/establishments/labels";

const SEARCH_MAX_LENGTH = 48;
const CHIP_LABEL_MAX = 16;

function truncateLabel(label: string, max = CHIP_LABEL_MAX) {
  if (label.length <= max) return label;
  return `${label.slice(0, max - 1)}…`;
}

type ChipOption = { value: string; label: string };

type ChipSection = {
  label: string;
  paramKey: string;
  allLabel?: string;
  options: ChipOption[];
};

type Props = {
  basePath: string;
  searchPlaceholder: string;
  active: Record<string, string | undefined>;
  showPrice?: boolean;
  chipSection?: ChipSection;
};

function buildHref(
  basePath: string,
  active: Record<string, string | undefined>,
  overrides: Record<string, string | undefined>,
) {
  const params = new URLSearchParams();
  const next = { ...active, ...overrides };
  Object.entries(next).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function ListingFilters({
  basePath,
  searchPlaceholder,
  active,
  showPrice = false,
  chipSection,
}: Props) {
  function href(overrides: Record<string, string | undefined>) {
    return buildHref(basePath, active, overrides);
  }

  const hiddenFields = Object.entries(active).filter(
    ([key, value]) => key !== "q" && value,
  );

  return (
    <div className="nemi-listing-toolbar">
      <div className="nemi-listing-toolbar-block">
        <form action={basePath} className="nemi-listing-search">
          <input
            type="search"
            name="q"
            defaultValue={active.q ?? ""}
            placeholder={searchPlaceholder}
            className="nemi-input"
            maxLength={SEARCH_MAX_LENGTH}
          />
          {hiddenFields.map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value} />
          ))}
          <button type="submit" className="nemi-btn nemi-btn-primary !py-2">
            Buscar
          </button>
        </form>
      </div>

      {showPrice ? (
        <div className="nemi-listing-toolbar-block">
          <p className="nemi-listing-toolbar-label">Precio</p>
          <div className="nemi-listing-chips">
            <FilterChip href={href({ precio: undefined })} active={!active.precio}>
              Todos
            </FilterChip>
            {Object.values(PriceRange).map((value) => (
              <FilterChip
                key={value}
                href={href({ precio: value })}
                active={active.precio === value}
                title={PRICE_RANGE_LABELS[value]}
              >
                {PRICE_RANGE_SHORT[value]}
              </FilterChip>
            ))}
          </div>
        </div>
      ) : null}

      {chipSection ? (
        <div className="nemi-listing-toolbar-block">
          <p className="nemi-listing-toolbar-label">{chipSection.label}</p>
          <div className="nemi-listing-chips">
            <FilterChip
              href={href({ [chipSection.paramKey]: undefined })}
              active={!active[chipSection.paramKey]}
            >
              {chipSection.allLabel ?? "Todas"}
            </FilterChip>
            {chipSection.options.map((option) => (
              <FilterChip
                key={option.value}
                href={href({ [chipSection.paramKey]: option.value })}
                active={active[chipSection.paramKey] === option.value}
                title={option.label}
              >
                {truncateLabel(option.label)}
              </FilterChip>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FilterChip({
  href,
  active,
  title,
  children,
}: {
  href: string;
  active: boolean;
  title?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`nemi-listing-chip${active ? " is-active" : ""}`}
      title={title}
    >
      {children}
    </Link>
  );
}
