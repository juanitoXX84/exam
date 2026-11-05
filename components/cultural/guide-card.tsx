import Link from "next/link";
import type { CulturalGuide, CulturalSignal } from "@prisma/client";
import {
  CulturalNormBadge,
  CulturalSignalBadge,
  VerificationBadge,
} from "@/components/cultural/badges";
import { CULTURAL_SIGNAL_LABELS } from "@/lib/cultural/labels";

type Props = {
  guide: CulturalGuide;
  destinationSlug: string;
};

const TONE_ICON: Record<
  "avoid" | "consider" | "recommended",
  string
> = {
  avoid: "M9 9l6 6M15 9l-6 6",
  consider: "M12 8v5M12 16.2h.01",
  recommended: "M7.5 12.5 10.5 15.5 16.5 9",
};

export function CulturalGuideCard({ guide, destinationSlug }: Props) {
  const tone = CULTURAL_SIGNAL_LABELS[guide.signal].tone;
  const iconPath = TONE_ICON[tone];

  return (
    <Link
      href={`/destinos/${destinationSlug}/cultura/${guide.slug}`}
      className={`nemi-culture-card nemi-culture-card--${tone}`}
    >
      <div className="nemi-culture-card-top">
        <span className={`nemi-culture-card-icon nemi-culture-card-icon--${tone}`}>
          <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden>
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="1.5"
              opacity="0.35"
            />
            <path
              d={iconPath}
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        <div className="nemi-culture-card-body">
          <div className="flex flex-wrap items-center gap-2">
            <CulturalSignalBadge signal={guide.signal} />
            <CulturalNormBadge normKind={guide.normKind} />
          </div>

          <h3 className="nemi-culture-card-title font-display">{guide.title}</h3>

          <p className="nemi-culture-card-summary">
            {guide.summary?.trim() || guide.description}
          </p>
        </div>
      </div>

      <div className="nemi-culture-card-footer">
        <VerificationBadge
          status={guide.verificationStatus}
          updatedAt={guide.lastVerifiedAt ?? guide.updatedAt}
        />
      </div>
    </Link>
  );
}

export function CultureSectionHeader({
  signal,
  count,
}: {
  signal: CulturalSignal;
  count: number;
}) {
  const meta = CULTURAL_SIGNAL_LABELS[signal];
  const blurb =
    signal === "AVOID"
      ? "Cosas que es mejor no hacer o que pueden complicarte la visita."
      : signal === "CONSIDER"
        ? "Matices locales que un foráneo casi nunca conoce de antemano."
        : "Hábitos que facilitan el día a día y te ayudan a moverte con más soltura.";

  return (
    <header className={`nemi-culture-section-head nemi-culture-section-head--${meta.tone}`}>
      <span className={`nemi-culture-section-mark nemi-culture-section-mark--${meta.tone}`}>
        <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden>
          <path
            d={TONE_ICON[meta.tone]}
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <div>
        <h2 className="font-display text-2xl tracking-tight">{meta.label}</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {blurb}
          {count > 0 ? ` · ${count}` : null}
        </p>
      </div>
    </header>
  );
}
