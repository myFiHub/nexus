import { AuroraBackground } from "app/components/AuroraBackground";
import Header from "app/components/header";
import { GlobalContainer } from "app/containers/global";
import { ReduxProvider } from "app/store/Provider";
import { AuthFlag } from "app/components/listeners/AuthFlag";
import { ReferralCapture } from "app/components/listeners/ReferralCapture";
import { bootScript } from "app/lib/bootScript";
import { DEFAULT_THEME } from "app/lib/theme";
import type { Metadata, Viewport } from "next";
import { Sora } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Sidebar } from "../components/Sidebar";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "dark light",
  themeColor: "#0B0B1E",
};

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme={DEFAULT_THEME}
      className={`dark ${sora.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="font-sans antialiased">
        <AuroraBackground />
        <NextTopLoader showSpinner={false} color="var(--p-accent)" />
        <ReduxProvider>
          <GlobalContainer />
          <AuthFlag />
          <ReferralCapture />
          <Header />
          <Sidebar />
          <main className="pt-16">{children}</main>
        </ReduxProvider>
      </body>
    </html>
  );
}
