import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import styles from "./layout.module.css";
import { Utensils } from "lucide-react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Chicagos Burger | Capacitación",
  description: "Sistema de preparación de productos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable}`}>
        <div className={styles.appContainer}>
          <nav className={`${styles.sidebar} glass`}>
            <div className={styles.logo}>
              <div className={styles.logoIcon}>
                <Utensils size={24} color="#f2f3f7" />
              </div>
              <span className={styles.logoText}>Chicagos</span>
            </div>
            
            <ul className={styles.navLinks}>
              <li>
                <a href="/" className={styles.navItem}>
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/admin" className={styles.navItem}>
                  Administración
                </a>
              </li>
            </ul>
          </nav>
          
          <main className={styles.mainContent}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
