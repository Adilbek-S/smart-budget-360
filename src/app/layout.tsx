import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { FilterProvider } from "@/lib/filter-context";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "Smart Budget 360",
  description: "Корпоративная система бюджетирования Smart Budget 360",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${roboto.variable} h-full antialiased`}>
      <body className="min-h-full bg-canvas text-ink">
        <FilterProvider>
          <AppShell>{children}</AppShell>
        </FilterProvider>
      </body>
    </html>
  );
}
