import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { NotificationProvider } from "./components/NotificationSystem";
import InitialNotifications from "./components/InitialNotifications";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IntelliConnect - Modern Dashboard",
  description: "A modern dashboard with glassmorphism UI and smooth animations",
  icons: {
    icon: '/intlogo.png'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-b from-blue-500 to-white min-h-screen`}
      >        <NotificationProvider>
          <InitialNotifications />
          <Sidebar />
          <Navbar />
          <main className="pt-16 pl-20 lg:pl-64 min-h-screen">
            <div className="p-6">
              {children}
            </div>
          </main>
        </NotificationProvider>
      </body>
    </html>
  );
}
