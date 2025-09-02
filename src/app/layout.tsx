import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/theme-provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kundodza – Plataforma de Aprendizagem e Comunidade",
  description:
    "Kundodza é a plataforma para aprender, praticar e crescer com a comunidade tech de Moçambique. Cursos práticos, comunidades ativas e desafios para acelerar sua jornada.",
  keywords: [
    "aprendizagem",
    "desenvolvimento",
    "programação",
    "cursos",
    "comunidade",
    "Moçambique",
  ],
  authors: [{ name: "Kundodza Team" }],
  creator: "Kundodza",
  publisher: "Kundodza",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://kundodza.com"),
  openGraph: {
    title: "Kundodza – Plataforma de Aprendizagem e Comunidade",
    description:
      "Aprenda com cursos práticos, conecte-se com a comunidade e alcance suas metas no ecossistema tech moçambicano.",
    url: "https://kundodza.com",
    siteName: "Kundodza",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kundodza – Plataforma de Aprendizagem e Comunidade",
    description:
      "Cursos práticos, comunidades ativas e desafios para acelerar seu aprendizado.",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
