import { RoleName } from "@prisma/client";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";

export async function requireAdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/iniciar-sesion");
  if (session.user.role !== RoleName.ADMIN) redirect("/cuenta");
  return session;
}
