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
  title: "ProShot — 셀카 한 장으로 AI 프로필 사진",
  description: "스튜디오 방문 없이 셀카 한 장으로 3분 만에 완벽한 AI 프로필 사진과 비즈니스 헤드샷을 만드세요.",
  keywords: ["AI 프로필", "AI 헤드샷", "ProShot", "프로필 사진", "비즈니스 프로필", "AI 사진관"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased light`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}

