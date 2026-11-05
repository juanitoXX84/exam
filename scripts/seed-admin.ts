import "dotenv/config";
import { PrismaClient, RoleName } from "@prisma/client";
import { hashPassword } from "../lib/auth/password";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL?.trim();
  const password = process.env.SEED_ADMIN_PASSWORD;
  const name = process.env.SEED_ADMIN_NAME?.trim() || "Administrador NEMI";

  if (!email || !password) {
    throw new Error(
      "Configura SEED_ADMIN_EMAIL y SEED_ADMIN_PASSWORD en .env",
    );
  }

  await prisma.role.upsert({
    where: { name: RoleName.ADMIN },
    update: {},
    create: {
      name: RoleName.ADMIN,
      description: "Administración de contenido y reportes.",
    },
  });

  const adminRole = await prisma.role.findUniqueOrThrow({
    where: { name: RoleName.ADMIN },
  });

  const passwordHash = await hashPassword(password);

  await prisma.user.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
      roleId: adminRole.id,
      isActive: true,
    },
    create: {
      email,
      name,
      passwordHash,
      roleId: adminRole.id,
    },
  });

  console.log(`Admin creado: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
