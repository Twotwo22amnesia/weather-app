import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clima",
  description: "Consulta el clima actual de cualquier ciudad",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
