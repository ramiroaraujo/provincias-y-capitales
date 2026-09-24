import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const title = "Provincias y Capitales";
const description = "Juego para aprender las capitales de las provincias argentinas, con mapa y contra reloj.";

export const metadata: Metadata = {
  metadataBase: new URL("https://provincias-y-capitales.vercel.app"),
  title,
  description,
  openGraph: { title, description, siteName: title, locale: "es_AR", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = {
  themeColor: "#2b7bbf",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${nunito.variable} antialiased`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
