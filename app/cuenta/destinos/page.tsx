import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { IconCompass } from "@/components/nemi/me-icons";
import { auth } from "@/lib/auth/auth";
import { formatRelativeTimeEs } from "@/lib/nemi/relative-time";
import { listVisitedDestinationsForUser } from "@/lib/nemi/visited-destinations";

export const metadata: Metadata = {
  title: "Mis destinos",
};

export default async function AccountDestinationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/iniciar-sesion");

  const destinations = await listVisitedDestinationsForUser(session.user.id);

  return (
    <div className="nemi-me nemi-container">
      <Link href="/cuenta" className="nemi-back-link text-sm">
        ← Mi cuenta
      </Link>
      <div className="mt-4 max-w-2xl">
        <section className="nemi-me-block">
          <h1 className="nemi-me-h2">Mis destinos</h1>
          <p className="nemi-me-lead">
            Destinos que has visitado y explorado en NEMI.
          </p>

          {destinations.length === 0 ? (
            <div className="nemi-me-empty">
              <span className="nemi-me-empty-icon" aria-hidden>
                <IconCompass />
              </span>
              <p className="nemi-me-empty-title">
                Todavía no has visitado ningún destino.
              </p>
              <p className="nemi-me-empty-copy">
                Entra a un destino para ver su información y aparecerá aquí.
              </p>
            </div>
          ) : (
            <ul className="nemi-me-dest-list mt-4">
              {destinations.map((destination) => {
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
      </div>
    </div>
  );
}
