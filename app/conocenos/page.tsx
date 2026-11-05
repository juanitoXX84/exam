import type { Metadata } from "next";
import { ConocenosContent } from "@/components/about/conocenos-content";
import { auth } from "@/lib/auth/auth";

export const metadata: Metadata = {
  title: "Conócenos",
  description:
    "Qué es NEMI, cómo funciona la plataforma y qué puedes hacer como viajero.",
};

export default async function ConocenosPage() {
  const session = await auth();

  return (
    <div className="nemi-about-page">
      <ConocenosContent isLoggedIn={Boolean(session?.user)} />
    </div>
  );
}
