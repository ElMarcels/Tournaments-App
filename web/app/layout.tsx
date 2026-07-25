// web/app/layout.tsx
import "../styles/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TournamentHub",
  description: "Global platform for managing esports tournaments.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="min-h-screen bg-gray-900 text-white">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}