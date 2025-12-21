import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/Navbar";
import { Toaster as HotToaster } from "react-hot-toast"
import { Footer } from "@/components/Footer";
import { Bebas_Neue, Montserrat, Raleway, Pacifico } from "next/font/google";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-headline",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-subtext",
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-subtext-alt",
  display: "swap",
});

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-accent",
  display: "swap",
});


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
      <body className={`${bebasNeue.variable} ${montserrat.variable} ${raleway.variable} ${pacifico.variable} min-h-screen bg-background text-foreground`} suppressHydrationWarning>
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
