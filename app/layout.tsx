import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HAUL — Find your next favorite thing",
  description: "Social shopping, styled for you."
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f6efe7" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
