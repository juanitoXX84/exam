import Link from "next/link";
import { CulturalSignal } from "@prisma/client";
import { CULTURAL_SIGNAL_LABELS } from "@/lib/cultural/labels";

const FILTERS: Array<{ value: CulturalSignal | "ALL"; label: string }> = [
  { value: "ALL", label: "Todas" },
  { value: CulturalSignal.AVOID, label: CULTURAL_SIGNAL_LABELS.AVOID.label },
  {
    value: CulturalSignal.CONSIDER,
    label: CULTURAL_SIGNAL_LABELS.CONSIDER.label,
  },
  {
    value: CulturalSignal.RECOMMENDED,
    label: CULTURAL_SIGNAL_LABELS.RECOMMENDED.label,
  },
];

type Props = {
  destinationSlug: string;
  active?: CulturalSignal | "ALL";
};

export function CulturalSignalFilters({
  destinationSlug,
  active = "ALL",
}: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((filter) => {
        const href =
          filter.value === "ALL"
            ? `/destinos/${destinationSlug}/cultura`
            : `/destinos/${destinationSlug}/cultura?senal=${filter.value}`;
        const isActive = active === filter.value;

        return (
          <Link
            key={filter.value}
            href={href}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              isActive
                ? "border-[rgba(45,212,191,0.5)] bg-[var(--accent-soft)] text-[var(--accent)] shadow-[0_0_0_1px_rgba(45,212,191,0.12)]"
                : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
            }`}
          >
            {filter.label}
          </Link>
        );
      })}
    </div>
  );
}
