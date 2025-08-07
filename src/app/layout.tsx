import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Strikeit – Minimal Online To-Do Lists",
  description: "Strikeit is the simplest way to create, share, and sync to-do lists online. No login required. Share lists by URL, sync instantly, and enjoy a minimal, dark-mode ready UI. Powered by Upstash Redis.",
  keywords: [
    "to-do list",
    "online to-do",
    "shareable lists",
    "minimal todo app",
    "strikeit",
    "Upstash Redis",
    "Next.js",
    "productivity",
    "task manager",
    "no login todo"
  ],
  icons: {
    icon: '/s-dark.svg',
    shortcut: '/s-dark.svg',
    apple: '/s-dark.svg',
  },
  openGraph: {
    title: "Strikeit – Minimal Online To-Do Lists",
    description: "Create and share to-do lists instantly. No login, minimal UI, instant sync. Try Strikeit now!",
    url: "https://strikeit-dun.vercel.app",
    images: [
      {
        url: "/img/image.png",
        width: 1200,
        height: 630,
        alt: "Strikeit screenshot"
      }
    ],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Strikeit – Minimal Online To-Do Lists",
    description: "Create and share to-do lists instantly. No login, minimal UI, instant sync. Try Strikeit now!",
    images: ["/img/image.png"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#18181b" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
      <Analytics/> 
    </html>
  );
}
