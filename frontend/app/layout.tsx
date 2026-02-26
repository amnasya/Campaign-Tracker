import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/lib/auth/useAuth";
import { ToastProvider } from "@/components/ui/toast";
import { DemoBanner } from "@/components/shared/DemoBanner";
import { DEMO_MODE } from "@/lib/api/demo-mode";
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
  title: "Campaign Tracker - Influencer Marketing Management",
  description: "Streamline your influencer marketing campaigns with our professional tracking platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ToastProvider>
            {DEMO_MODE && <DemoBanner />}
            <div className={DEMO_MODE ? 'pt-10' : ''}>
              {children}
            </div>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
