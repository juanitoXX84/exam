"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toggleFavoriteAction } from "@/app/actions/favorite";

type Props = {
  establishmentId: string;
  initialFavorited: boolean;
  isLoggedIn: boolean;
  emphasize?: boolean;
};

export function FavoriteButton({
  establishmentId,
  initialFavorited,
  isLoggedIn,
  emphasize = false,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (!isLoggedIn) {
    return (
      <Link
        href="/iniciar-sesion"
        className={`nemi-btn text-sm ${
          emphasize ? "nemi-btn-primary" : "nemi-btn-ghost !px-3 !py-1.5"
        }`}
      >
        Guardar favorito
      </Link>
    );
  }

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          await toggleFavoriteAction(formData);
          router.refresh();
        });
      }}
    >
      <input type="hidden" name="establishmentId" value={establishmentId} />
      <button
        type="submit"
        disabled={pending}
        className={`nemi-btn text-sm ${
          initialFavorited || emphasize
            ? "nemi-btn-primary"
            : "nemi-btn-ghost !px-3 !py-1.5"
        } ${emphasize ? "" : "!px-3 !py-1.5"}`}
      >
        {pending
          ? "…"
          : initialFavorited
            ? "En favoritos"
            : "Guardar favorito"}
      </button>
    </form>
  );
}
