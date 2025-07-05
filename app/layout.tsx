import Header from "app/components/header";
import { cookies } from "next/headers";

import LoadingIndicator from "app/app/loading-indicator";
import { GlobalContainer } from "app/containers/global";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SimpleSidebar } from "../components/Sidebar";
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
  title: {
    default: "Podium Nexus - Connect, Create, Collaborate",
    template: "%s | Podium Nexus",
  },
  description:
    "Podium Nexus is a platform for creating and joining collaborative outposts. Connect with creators, participate in live events, and build meaningful communities.",
  keywords: [
    "collaboration",
    "outposts",
    "live events",
    "community",
    "creators",
    "social platform",
  ],
  authors: [{ name: "Podium Nexus Team" }],
  creator: "Podium Nexus",
  publisher: "Podium Nexus",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_WEBSITE_LINK_URL || "https://podiumnexus.com"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Podium Nexus - Connect, Create, Collaborate",
    description:
      "Join collaborative outposts, connect with creators, and participate in live events. Build meaningful communities on Podium Nexus.",
    siteName: "Podium Nexus",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Podium Nexus Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Podium Nexus - Connect, Create, Collaborate",
    description:
      "Join collaborative outposts, connect with creators, and participate in live events.",
    images: ["/logo.png"],
    creator: "@web3podium",
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
  icons: {
    icon: [
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/logo.png",
    apple: "/logo.png",
    other: [
      {
        rel: "mask-icon",
        url: "/logo.png",
        color: "#000000",
      },
    ],
  },
  manifest: "/manifest.json",
  category: "social",
  classification: "social networking",
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
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LoadingIndicator />
        <GlobalContainer />
        <Header theme={theme as "light" | "dark"} />
        <SimpleSidebar />
        <main className="pt-24">{children}</main>
      </body>
    </html>
  );
}
