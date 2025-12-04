import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/Navbar";
import { Toaster as HotToaster } from "react-hot-toast"
import { Footer } from "@/components/Footer";


export const metadata: Metadata = {
  title: "Portfolio",
  description: "Personal portfolio with blog",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <Providers>
          <Navbar />
          <HotToaster position="top-center" />
          <main className="container mx-auto px-4 py-6">{children}</main>
          <Footer/>
        </Providers>
      </body>
    </html>
  );
}
