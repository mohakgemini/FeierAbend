import type { Metadata } from "next";
import { Anton, Inter, Oswald } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" });
const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton" });

export const metadata: Metadata = { title: "Feierabend.fm — Früher klingt besser", description: "Nostalgisches deutsches Internetradio." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="de"><body className={`${inter.variable} ${oswald.variable} ${anton.variable}`}>{children}</body></html>;
}
