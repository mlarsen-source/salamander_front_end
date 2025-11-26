import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="site-header">
          <div className="site-header__inner">
            <div className="site-header__brand">Brand Placeholder</div>
            <div className="site-header__placeholder" />
          </div>
        </header>
        <main className="site-container">
          {children}
        </main>
      </body>
    </html>
  );
}
