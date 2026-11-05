import Link from "next/link";
import { DestinationForm } from "@/components/admin/destination-form";

export const metadata = { title: "Nuevo destino · Admin" };

export default function AdminNewDestinationPage() {
  return (
    <div>
      <Link href="/admin/destinos" className="nemi-back-link text-sm">
        ← Destinos
      </Link>
      <div className="nemi-admin-header !mb-4 mt-6">
        <p className="nemi-admin-kicker">Contenido</p>
        <h2 className="nemi-admin-title !text-2xl">Nuevo destino</h2>
      </div>
      <div className="nemi-admin-panel">
        <DestinationForm />
      </div>
    </div>
  );
}
