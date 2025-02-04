import "./globals.css";
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ClientProvider from "./clientProvider";
import Header from "./components/header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Controle Financeiro",
  description: "Gerado para controles de finanças.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${inter.variable} antialiased`}>
        <ClientProvider>
          <Header />
          <main className="max-w-4x1 mx-auto justify-center flex">
            {children}
          </main>
        </ClientProvider>
      </body>
    </html>
  );
}