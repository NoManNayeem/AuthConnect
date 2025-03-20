import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "./components/Navbar"; 
import Footer from "./components/Footer";



// Configure fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "AuthConnect | Secure Authentication",
  description: "Authenticate and access protected routes with ease",
  icons: {
    icon: "/favicon.ico",
  },
};



export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <main className="flex-1">
        {/* <Navbar /> */}
          {children}
        </main>
        {/* <Footer /> */}
      </body>
    </html>
  );
}