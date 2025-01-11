import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"], // Choose the subsets you need
  weight: ["400", "700"], // Include the desired font weights
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Task Manager",
  description: "Your own tasks manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>{children}</body>
    </html>
  );
}
