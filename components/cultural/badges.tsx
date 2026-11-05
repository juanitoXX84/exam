import {
  CulturalNormKind,
  CulturalSignal,
  ImportanceLevel,
  VerificationStatus,
} from "@prisma/client";
import {
  CULTURAL_NORM_LABELS,
  CULTURAL_SIGNAL_LABELS,
  IMPORTANCE_LABELS,
} from "@/lib/cultural/labels";

const toneClass: Record<
  "avoid" | "consider" | "recommended",
  string
> = {
  avoid: "border-[rgba(248,113,113,0.35)] bg-[rgba(248,113,113,0.1)] text-[#fca5a5]",
  consider:
    "border-[rgba(251,191,36,0.35)] bg-[rgba(251,191,36,0.1)] text-[#fcd34d]",
  recommended:
    "border-[rgba(45,212,191,0.35)] bg-[rgba(45,212,191,0.1)] text-[#5eead4]",
};

export function CulturalSignalBadge({ signal }: { signal: CulturalSignal }) {
  const meta = CULTURAL_SIGNAL_LABELS[signal];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${toneClass[meta.tone]}`}
    >
      {meta.label}
    </span>
  );
}

export function CulturalNormBadge({ normKind }: { normKind: CulturalNormKind }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.03)] px-2.5 py-0.5 text-xs text-[var(--muted)]">
      {CULTURAL_NORM_LABELS[normKind]}
    </span>
  );
}

export function VerificationBadge({
  status,
}: {
  status: VerificationStatus;
  updatedAt?: Date | string | null;
}) {
  const isVerified = status === VerificationStatus.VERIFIED;
  const isReported = status === VerificationStatus.REPORTED;

  if (!isVerified && !isReported) {
    return null;
  }

  return (
    <div className="text-xs text-[var(--muted)]">
      <p className={isVerified ? "text-[var(--accent)]" : "text-[#fcd34d]"}>
        {isVerified
          ? "✓ Información verificada"
          : "⚠ Información reportada — en revisión"}
      </p>
    </div>
  );
}

export function ImportanceLabel({ importance }: { importance: ImportanceLevel }) {
  return <span>{IMPORTANCE_LABELS[importance]}</span>;
}
