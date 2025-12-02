import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="site-header">
          <div className="site-header__inner">
            <h2 className="site-header__brand">Salamander Centroid Finder</h2>
            <img src="./salamander-2.svg" className="header-img" />
          </div>
        </header>
        <main className="site-container">
          {children}
        </main>
      </body>
    </html>
  );
}
