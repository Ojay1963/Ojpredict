import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/layout/Providers"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://ojpredict.com"),
  title: {
    default: "OJ Predict — AI-Powered Football Predictions",
    template: "%s | OJ Predict",
  },
  description:
    "Nigeria's most trusted AI-powered football prediction platform. Free tips and VIP predictions with AI analysis and real-time scores.",
  keywords: [
    "OJ Predict",
    "football predictions Nigeria",
    "sure prediction today Nigeria",
    "football tips today",
    "over 2.5 predictions",
    "BTTS tips",
    "banker of the day",
  ],
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://ojpredict.com",
    siteName: "OJ Predict",
    title: "OJ Predict — Predict Smart. Win Big.",
    description: "AI-Powered Football Predictions. Free + VIP Tips. Nigeria's best prediction site.",
    images: [{ url: "/images/og-default.png", width: 1200, height: 630, alt: "OJ Predict" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "OJ Predict",
    description: "AI-Powered Football Predictions",
    images: ["/images/og-default.png"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  )
}
