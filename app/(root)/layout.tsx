import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import RightSideBar from "@/components/shared/RightSideBar";
import LeftSideBar from "@/components/shared/LeftSideBar";
import TopBar from "@/components/shared/TopBar";
import BottomBar from "@/components/shared/BottomBar";
import {ClerkProvider} from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: 'Threads',
    description: 'A Next.js 14 Meta Threads Application'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <ClerkProvider>
          <TopBar />
          <main className={'flex flex-grow'}>
              <LeftSideBar />
              <section className={'main-container'}>
                  <div className="w-full max-w-4xl">
                      {children}
                  </div>
              </section>
              <RightSideBar />
          </main>
          <BottomBar />
      </ClerkProvider>
      </body>
    </html>
  );
}
