import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/authProvider";

export const metadata: Metadata = {
  title: "PersonData",
  description: "PersonData",
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
