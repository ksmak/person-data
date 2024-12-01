import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/authProvider";

export const metadata: Metadata = {
  title: "Qarau",
  description: "Qarau",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
