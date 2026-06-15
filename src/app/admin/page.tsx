import prisma from "@/lib/prisma";
import styles from "./page.module.css";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminDashboard() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: { createdAt: "desc" }
  });

  async function deleteProduct(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    if (id) {
      await prisma.product.delete({ where: { id } });
      revalidatePath("/admin");
      revalidatePath("/");
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Panel Administrativo</h1>
          <p className={styles.subtitle}>Gestiona los productos, ingredientes y recetas.</p>
        </div>
        <Link href="/admin/product/new" className={styles.addButton}>
          <Plus size={20} />
          Nuevo Producto
        </Link>
      </header>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Tiempo Est.</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className={styles.productName}>{product.name}</td>
                <td>{product.category.name}</td>
                <td>{product.estimatedTime} min</td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.iconBtn} title="Editar">
                      <Edit size={18} />
                    </button>
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={product.id} />
                      <button type="submit" className={`${styles.iconBtn} ${styles.deleteBtn}`} title="Eliminar">
                        <Trash2 size={18} />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={4} className={styles.emptyState}>
                  No hay productos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
