import prisma from "@/lib/prisma";
import styles from "./page.module.css";
import Link from "next/link";
import { ArrowLeft, Play, Clock, Info } from "lucide-react";
import TrainingModeClient from "@/components/TrainingModeClient";

export default async function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      ingredients: {
        include: {
          ingredient: true,
        },
      },
      steps: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!product) {
    return <div>Producto no encontrado</div>;
  }

  // Preparamos datos para el cliente (modo capacitación)
  const stepsList = product.steps.map(s => s.description);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.backButton}>
          <ArrowLeft size={20} />
          <span>Volver</span>
        </Link>
        <div className={styles.actions}>
          {/* El botón de play inicia el modo cliente */}
          <TrainingModeClient steps={stepsList} productName={product.name} />
        </div>
      </header>

      <div className={styles.mainContent}>
        <div className={styles.visualizer}>
          <div className={styles.imagePlaceholder}>
            {/* Aquí iría el Canvas 3D en el futuro */}
            <span className={styles.emoji}>
              {product.category.name === "Hamburguesas" ? "🍔" : 
               product.category.name === "Hot Dogs" ? "🌭" : "🍟"}
            </span>
          </div>
          <div className={styles.metaInfo}>
            <div className={styles.metaItem}>
              <Clock size={18} className={styles.metaIcon} />
              <span>{product.estimatedTime} min</span>
            </div>
            <div className={styles.metaItem}>
              <Info size={18} className={styles.metaIcon} />
              <span>{product.observations || "Sin observaciones especiales"}</span>
            </div>
          </div>
        </div>

        <div className={styles.details}>
          <h1 className={styles.title}>{product.name}</h1>
          <p className={styles.categoryName}>{product.category.name}</p>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Ingredientes</h2>
            <div className={styles.ingredientsGrid}>
              {product.ingredients.map((pi) => (
                <div key={pi.id} className={styles.ingredientCard}>
                  <span className={styles.ingredientName}>{pi.ingredient.name}</span>
                  {pi.notes && <span className={styles.ingredientNotes}>{pi.notes}</span>}
                </div>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Orden de Preparación</h2>
            <ul className={styles.stepsList}>
              {product.steps.map((step) => (
                <li key={step.id} className={styles.stepItem}>
                  <div className={styles.stepNumber}>{step.order}</div>
                  <div className={styles.stepDesc}>{step.description}</div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
