import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { EditProfileForm } from "@/components/nemi/edit-profile-form";
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll";
import { auth } from "@/lib/auth/auth";
import { getAccountProfile } from "@/services/auth.service";

export const metadata: Metadata = {
  title: "Editar perfil",
};

export default async function EditProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/iniciar-sesion");

  const profile = await getAccountProfile(session.user.id);
  const name = profile?.name?.trim() || session.user.name?.trim() || "";
  const email = profile?.email || session.user.email || "";
  const displayName =
    name && name !== "Turista NEMI" ? name : "viajero";
  const initial =
    displayName === "viajero" ? "N" : displayName.charAt(0).toUpperCase();

  return (
    <div className="nemi-me nemi-container nemi-me-profile-page">
      <Link href="/cuenta" className="nemi-back-link text-sm">
        ← Mi cuenta
      </Link>

      <RevealOnScroll className="nemi-me-profile-hero">
        <p className="nemi-me-section-eyebrow">Cuenta</p>
        <h1 className="nemi-me-profile-title font-display">Editar perfil</h1>
        <p className="nemi-me-profile-lead">
          Administra tu identidad y seguridad en NEMI.
        </p>
      </RevealOnScroll>

      <RevealOnScroll delayMs={40} className="nemi-me-profile-wrap">
        <EditProfileForm
          name={name}
          email={email}
          image={profile?.image ?? session.user.image ?? null}
          initial={initial}
          hasPassword={profile?.hasPassword ?? false}
        />
      </RevealOnScroll>
    </div>
  );
}
