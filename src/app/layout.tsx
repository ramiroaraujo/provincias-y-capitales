import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Provincias y Capitales",
  description: "Juego para aprender las capitales de las provincias argentinas",
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
