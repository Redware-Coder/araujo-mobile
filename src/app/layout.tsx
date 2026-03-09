import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/sidebar";
import { FiltroProvider } from "@/components/contexts/FiltroContext";

const inter = Inter({ subsets: ["latin"] });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Araújo Pneus - Mobile",
  description:
    "Sistema integrado ao sistema local, trazendo informações de forma agrupada e rápida.",
  manifest: "/manifest.json",
  themeColor: "#000000",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "h-full bg-background font-sans antialiased",
          inter.className
        )}
      >
        <FiltroProvider>
          <Sidebar></Sidebar>
          {children}

          {/* DevTools só em modo desenvolvimento */}
          {process.env.NODE_ENV === "development" &&
            typeof window !== "undefined" &&
            (() => {
              // Aqui você pode importar qualquer devtool dinamicamente
              // Exemplo com React Query Devtools:
              try {
                const { ReactQueryDevtools } = require("@tanstack/react-query-devtools");
                return <ReactQueryDevtools initialIsOpen={false} />;
              } catch {
                return null;
              }
            })()}
        </FiltroProvider>
      </body>
    </html>
  );
}