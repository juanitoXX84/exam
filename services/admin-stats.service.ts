import { prisma } from "@/lib/db/prisma";

export async function getAdminDashboardStats() {
  const [openReports, totalReports, totalReviews, totalDestinations] =
    await Promise.all([
      prisma.report.count({ where: { status: "OPEN" } }),
      prisma.report.count(),
      prisma.review.count(),
      prisma.destination.count(),
    ]);

  return { openReports, totalReports, totalReviews, totalDestinations };
}
