import Link from "next/link";
import { IconCompass } from "@/components/nemi/me-icons";
import type { VisitedDestination } from "@/lib/nemi/visited-destinations";
import { formatRelativeTimeEs } from "@/lib/nemi/relative-time";

type Props = {
  destinations: VisitedDestination[];
  previewLimit?: number;
};

export function RecentDestinationsPanel({
  destinations,
  previewLimit = 3,
}: Props) {
  const visible = destinations.slice(0, previewLimit);

  return (
    <section id="destinos" className="nemi-me-block nemi-me-block--compact">
      <div className="nemi-me-block-head">
        <div>
          <p className="nemi-me-section-eyebrow">Destinos</p>
          <h2 className="nemi-me-h2 font-display">Destinos recientes</h2>
          <p className="nemi-me-lead">Destinos que has visitado recientemente.</p>
        </div>
        {destinations.length > 0 ? (
          <Link href="/cuenta/destinos" className="nemi-me-more">
            Ver todos
          </Link>
        ) : null}
      </div>

      {destinations.length === 0 ? (
        <div className="nemi-me-empty nemi-me-empty--tight">
          <p className="nemi-me-empty-copy">
            Entra a un destino para ver su información y aparecerá aquí.
          </p>
        </div>
      ) : (
        <ul className="nemi-me-dest-list">
          {visible.map((destination) => {
            const placeLine = [destination.region, destination.country]
              .filter(Boolean)
              .join(" · ");

            return (
              <li key={destination.slug}>
                <Link
                  href={`/destinos/${destination.slug}`}
                  className="nemi-me-dest-row"
                >
                  <div className="nemi-me-dest-row-media">
                    {destination.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={destination.coverImage} alt="" />
                    ) : (
                      <span className="nemi-me-dest-row-fallback" aria-hidden>
                        <IconCompass />
                      </span>
                    )}
                  </div>
                  <div className="nemi-me-dest-row-body">
                    <p className="nemi-me-dest-row-name">{destination.name}</p>
                    {placeLine ? (
                      <p className="nemi-me-meta">{placeLine}</p>
                    ) : null}
                    <p className="nemi-me-meta">
                      Visitado{" "}
                      {formatRelativeTimeEs(destination.visitedAt).toLowerCase()}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
