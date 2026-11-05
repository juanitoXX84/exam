import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { toggleFavoriteAction } from "@/app/actions/favorite";
import { ESTABLISHMENT_TYPE_LABELS } from "@/lib/establishments/labels";
import { establishmentPublicPath } from "@/lib/establishments/paths";
import { listFavoritesForUser } from "@/services/favorite.service";

export const metadata: Metadata = {
  title: "Mis favoritos",
};

export default async function FavoritesPage() {
  const session = await auth();
  if (!session?.user) redirect("/iniciar-sesion");

  const favorites = await listFavoritesForUser(session.user.id);

  return (
    <div className="nemi-container py-12 sm:py-16">
      <Link href="/cuenta" className="nemi-back-link text-sm">
        ← Mi cuenta
      </Link>
      <h1 className="font-display mt-3 text-3xl tracking-tight">
        Mis favoritos
      </h1>

      {favorites.length === 0 ? (
        <div className="nemi-bento nemi-bento-glass mt-8 p-6">
          <p className="font-medium">Aún no tienes favoritos</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Guarda restaurantes, hospedaje o lugares desde su ficha.
          </p>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {favorites.map((favorite) => {
            const item = favorite.establishment;
            const href = establishmentPublicPath(
              item.destination.slug,
              item.type,
              item.slug,
            );
            return (
              <li
                key={favorite.id}
                className="nemi-bento nemi-bento-glass flex flex-wrap items-center justify-between gap-3 p-4"
              >
                <div>
                  <p className="text-xs tracking-[0.14em] text-[var(--muted)] uppercase">
                    {ESTABLISHMENT_TYPE_LABELS[item.type]}
                  </p>
                  <Link href={href} className="mt-1 block text-lg font-medium">
                    {item.name}
                  </Link>
                  <p className="text-sm text-[var(--muted)]">
                    {item.destination.name}
                  </p>
                </div>
                <form action={toggleFavoriteAction}>
                  <input
                    type="hidden"
                    name="establishmentId"
                    value={item.id}
                  />
                  <button
                    type="submit"
                    className="nemi-btn nemi-btn-ghost !px-3 !py-1.5 text-sm"
                  >
                    Quitar
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
