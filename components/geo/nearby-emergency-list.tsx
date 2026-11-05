import type { EstablishmentType } from "@prisma/client";
import { ESTABLISHMENT_TYPE_LABELS } from "@/lib/establishments/labels";

export type EmergencyListItem = {
  id: string;
  name: string;
  type: EstablishmentType;
  phone: string | null;
  address: string | null;
  notes: string | null;
  isOfficial: boolean;
  sourceNote: string | null;
  latitude: number | null;
  longitude: number | null;
};

type Props = {
  official: EmergencyListItem[];
  other: EmergencyListItem[];
};

export function NearbyEmergencyList({ official, other }: Props) {
  return (
    <>
      {official.length > 0 ? (
        <section className="mb-10">
          <h2 className="font-display text-xl tracking-tight">Fuentes oficiales</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {official.map((item) => (
              <EmergencyCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      ) : null}

      {other.length > 0 ? (
        <section>
          <h2 className="font-display text-xl tracking-tight">Otros contactos</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {other.map((item) => (
              <EmergencyCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}

function EmergencyCard({ item }: { item: EmergencyListItem }) {
  return (
    <article className="nemi-bento nemi-bento-glass nemi-bento-glow-rose p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs tracking-[0.14em] text-[var(--muted)] uppercase">
            {ESTABLISHMENT_TYPE_LABELS[item.type]}
          </p>
          <h3 className="mt-1 text-lg font-medium">{item.name}</h3>
        </div>
        <span
          className={`rounded-full border px-2 py-0.5 text-[10px] tracking-[0.12em] uppercase ${
            item.isOfficial
              ? "border-[rgba(45,212,191,0.35)] bg-[var(--accent-soft)] text-[var(--accent)]"
              : "border-[var(--border)] text-[var(--muted)]"
          }`}
        >
          {item.isOfficial ? "Oficial" : "No oficial"}
        </span>
      </div>

      {item.phone ? (
        <a
          href={`tel:${item.phone}`}
          className="mt-4 inline-flex text-2xl font-semibold tracking-tight text-[var(--foreground)]"
        >
          {item.phone}
        </a>
      ) : (
        <p className="mt-4 text-sm text-[var(--muted)]">Sin teléfono</p>
      )}

      {item.address ? (
        <p className="mt-2 text-sm text-[var(--muted)]">{item.address}</p>
      ) : null}
      {item.notes ? (
        <p className="mt-3 text-sm text-[var(--muted)]">{item.notes}</p>
      ) : null}
      {item.sourceNote ? (
        <p className="mt-4 text-xs text-[var(--muted)]">Fuente: {item.sourceNote}</p>
      ) : null}
    </article>
  );
}
