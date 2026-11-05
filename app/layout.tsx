import type { Metadata } from "next";
import { Figtree, Fraunces } from "next/font/google";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NEMI — Orientación turística y cultural",
    template: "%s · NEMI",
  },
  description:
    "Conoce el lugar antes de vivirlo. Orientación cultural y herramientas prácticas para viajeros.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${figtree.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex flex-1 flex-col">{children}</main>
      </body>
    </html>
  );
}
