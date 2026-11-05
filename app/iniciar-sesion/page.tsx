import type { Metadata } from "next";
import { LoginPanel } from "@/components/auth/login-panel";

export const metadata: Metadata = {
  title: "Iniciar sesión",
};

export default function LoginPage() {
  return (
    <div className="nemi-container flex flex-1 flex-col justify-center py-10 sm:py-14">
      <LoginPanel />
    </div>
  );
}
