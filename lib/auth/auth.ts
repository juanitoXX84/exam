import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { RoleName } from "@prisma/client";
import { cache } from "react";
import { prisma } from "@/lib/db/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { authConfig } from "@/lib/auth/auth.config";
import { loginSchema } from "@/lib/validators/auth";

const { handlers, signIn, signOut, unstable_update, auth: resolveAuth } =
  NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(rawCredentials) {
        const parsed = loginSchema.safeParse(rawCredentials);

        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({
          where: { email },
          include: { role: true },
        });

        if (!user || !user.isActive || !user.passwordHash) {
          return null;
        }

        const isValid = await verifyPassword(password, user.passwordHash);

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role.name,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role as RoleName;
        if (user.name) token.name = user.name;
        if (user.image) token.picture = user.image;
      }
      if (trigger === "update") {
        const name = session?.user?.name ?? session?.name;
        if (typeof name === "string") token.name = name;
        const image = session?.user?.image;
        if (image === null) token.picture = null;
        else if (typeof image === "string") token.picture = image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as RoleName;
        if (typeof token.name === "string") session.user.name = token.name;
        if (token.picture === null) session.user.image = null;
        else if (typeof token.picture === "string") {
          session.user.image = token.picture;
        }
      }
      return session;
    },
  },
});

export { handlers, signIn, signOut, unstable_update };
/** Una sola resolución de sesión por request (header + página). */
export const auth = cache(resolveAuth);
