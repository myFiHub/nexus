import Header from "app/components/header";
import { cookies } from "next/headers";

import { GlobalContainer } from "app/containers/global";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LoadingIndicator from "app/app/loading-indicator";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Podium Nexus",
  description: "Podium Nexus",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value || "dark"; // default to light

  return (
    <html lang="en" className={theme}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LoadingIndicator />
        <GlobalContainer />
        <Header theme={theme as "light" | "dark"} />
        {children}
      </body>
    </html>
  );
}
