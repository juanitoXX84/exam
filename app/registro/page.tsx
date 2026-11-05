import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";
import { NemiLogo } from "@/components/brand/nemi-logo";

export const metadata: Metadata = {
  title: "Registro",
};

export default function RegisterPage() {
  return (
    <div className="nemi-container flex flex-1 flex-col justify-center py-12 sm:py-16">
      <div className="nemi-glass mx-auto w-full max-w-md rounded-[1.25rem] p-6 sm:p-8">
        <div className="mb-6">
          <NemiLogo href="/" size={36} showText animated />
        </div>
        <p className="text-xs tracking-[0.2em] text-[var(--muted)] uppercase">
          Cuenta
        </p>
        <h1 className="font-display mt-2 text-3xl tracking-tight">
          Crear cuenta
        </h1>
        <p className="mt-2 mb-8 text-sm text-[var(--muted)]">
          Regístrate como turista para guardar favoritos y reseñas de
          establecimientos.
        </p>
        <RegisterForm />
      </div>
    </div>
  );
}
