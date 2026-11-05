import type { NextAuthConfig } from "next-auth";

/**
 * Configuración edge-compatible (sin Prisma ni bcrypt).
 * La lógica de Credentials vive en `auth.ts`.
 */
export const authConfig = {
  pages: {
    signIn: "/iniciar-sesion",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isLoggedIn = !!auth?.user;

      const isAuthPage =
        pathname.startsWith("/iniciar-sesion") ||
        pathname.startsWith("/registro");

      const isProtected =
        pathname.startsWith("/cuenta") || pathname.startsWith("/admin");

      if (isAuthPage && isLoggedIn) {
        return Response.redirect(new URL("/", request.nextUrl));
      }

      if (isProtected && !isLoggedIn) {
        return false;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
