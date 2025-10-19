import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "¡Regresa! - Encuentra Mascotas Perdidas",
  description: "Plataforma comunitaria para ayudar a encontrar mascotas perdidas. Reporta avistamientos y reúne a las mascotas con sus familias.",
  keywords: ["mascotas perdidas", "encontrar mascotas", "reportar avistamientos", "animales perdidos", "Regresa"],
  authors: [{ name: "Regresa Team" }],
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "¡Regresa! - Encuentra Mascotas Perdidas",
    description: "Plataforma comunitaria para ayudar a encontrar mascotas perdidas",
    url: "https://regresa.vercel.app",
    siteName: "¡Regresa!",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "¡Regresa! - Encuentra Mascotas Perdidas",
    description: "Plataforma comunitaria para ayudar a encontrar mascotas perdidas",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
