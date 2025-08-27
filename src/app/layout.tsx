import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/theme-provider";
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dondza - Plataforma de Desenvolvimento",
  description:
    "Plataforma completa para desenvolvedores. Gerencie projetos, colabore com equipes e acelere seu desenvolvimento.",
  keywords: [
    "desenvolvimento",
    "programação",
    "colaboração",
    "equipe",
    "projetos",
  ],
  authors: [{ name: "Dondza Team" }],
  creator: "Dondza",
  publisher: "Dondza",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://dondza.com"),
  openGraph: {
    title: "Dondza - Plataforma de Desenvolvimento",
    description:
      "Plataforma completa para desenvolvedores. Gerencie projetos, colabore com equipes e acelere seu desenvolvimento.",
    url: "https://dondza.com",
    siteName: "Dondza",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dondza - Plataforma de Desenvolvimento",
    description:
      "Plataforma completa para desenvolvedores. Gerencie projetos, colabore com equipes e acelere seu desenvolvimento.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${jetbrainsMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
