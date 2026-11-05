import Link from "next/link";
import { AdminNav } from "@/components/admin/admin-nav";
import { requireAdminPage } from "@/lib/admin/require-admin-page";
import "../admin.css";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminPage();

  return (
    <div className="nemi-container nemi-admin-shell">
      <div className="nemi-admin-header max-sm:!mb-3">
        <p className="nemi-admin-kicker">Administración NEMI</p>
        <h1 className="nemi-admin-title text-2xl sm:text-3xl">Panel de control</h1>
      </div>
      <AdminNav />
      {children}
    </div>
  );
}
