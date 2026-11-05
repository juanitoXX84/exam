import Link from "next/link";
import { RoleName } from "@prisma/client";
import { auth } from "@/lib/auth/auth";
import { AboutNavLink } from "@/components/layout/about-nav-link";
import { ExploreNavLink } from "@/components/layout/explore-nav-link";
import { HomeLogoLink } from "@/components/layout/home-logo-link";
import { ProfileMenu } from "@/components/layout/profile-menu";

export async function SiteHeader() {
  const session = await auth();
  const name = session?.user?.name?.trim() || "";
  const initial =
    name && name !== "Turista NEMI" ? name.charAt(0).toUpperCase() : "N";

  return (
    <header className="nemi-site-header sticky top-0 z-40">
      <div className="nemi-container flex min-h-14 items-center justify-between py-3">
        <HomeLogoLink size={28} showText animated={false} />

        <nav className="nemi-header-nav flex items-center gap-5 text-sm">
          <AboutNavLink />
          <ExploreNavLink />

          {session?.user ? (
            <ProfileMenu
              name={name}
              image={session.user.image ?? null}
              initial={initial}
              isAdmin={session.user.role === RoleName.ADMIN}
            />
          ) : (
            <Link
              href="/iniciar-sesion"
              className="nemi-btn nemi-btn-primary !px-3.5 !py-1.5"
            >
              Iniciar sesión
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
