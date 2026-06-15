import prisma from "@/lib/prisma";
import styles from "./page.module.css";
import Link from "next/link";
import { Search } from "lucide-react";

export default async function Dashboard() {
  const categories = await prisma.category.findMany({
    include: {
      products: true,
    },
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Menú de Preparación</h1>
          <p className={styles.subtitle}>Selecciona un producto para ver el paso a paso.</p>
        </div>
        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} size={20} />
          <input 
            type="text" 
            placeholder="Buscar hamburguesa, hot dog, ingrediente..." 
            className={styles.searchInput}
          />
        </div>
      </header>

      <div className={styles.categories}>
        {categories.map((category) => (
          <section key={category.id} className={styles.categorySection}>
            <h2 className={styles.categoryTitle}>{category.name}</h2>
            <div className={styles.grid}>
              {category.products.map((product) => (
                <Link href={`/product/${product.id}`} key={product.id} className={styles.card}>
                  <div className={styles.cardImagePlaceholder}>
                    <span className={styles.emoji}>
                      {category.name === "Hamburguesas" ? "🍔" : 
                       category.name === "Hot Dogs" ? "🌭" : "🍟"}
                    </span>
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.productName}>{product.name}</h3>
                    <p className={styles.productTime}>⏱ {product.estimatedTime} min</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
