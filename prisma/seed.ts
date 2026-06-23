import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  // Categorías
  const catHamburguesas = await prisma.category.upsert({
    where: { name: 'Hamburguesas' },
    update: {},
    create: { name: 'Hamburguesas' },
  })

  const catHotDogs = await prisma.category.upsert({
    where: { name: 'Hot Dogs' },
    update: {},
    create: { name: 'Hot Dogs' },
  })

  // const catSalchipapas = await prisma.category.upsert({
  //   where: { name: 'Salchipapas' },
  //   update: {},
  //   create: { name: 'Salchipapas' },
  // })

  // Helper para productos
  const createProduct = async (
    name: string,
    category: { id: string },
    steps: string[],
    ingredientNames: string[]
  ) => {
    // 1. Crear producto base si no existe
    const product = await prisma.product.upsert({
      where: { name },
      update: {},
      create: {
        name,
        categoryId: category.id,
        estimatedTime: 10,
        observations: 'Asegurar buena presentación',
      },
    })

    // 2. Crear pasos
    for (let i = 0; i < steps.length; i++) {
      await prisma.step.upsert({
        where: {
          productId_order: {
            productId: product.id,
            order: i + 1,
          },
        },
        update: { description: steps[i] },
        create: {
          productId: product.id,
          order: i + 1,
          description: steps[i],
        },
      })
    }

    // 3. Crear ingredientes (los extraemos de los pasos por simplicidad en el seed)
    for (const ingName of ingredientNames) {
      const ingredient = await prisma.ingredient.upsert({
        where: { name: ingName },
        update: {},
        create: { name: ingName },
      })

      // Vincular ingrediente al producto
      try {
        await prisma.productIngredient.create({
          data: {
            productId: product.id,
            ingredientId: ingredient.id,
          },
        })
      } catch (_e) {
        // Ignorar si ya existe
      }
    }

    console.log(`Creado producto: ${name}`)
  }

  // --- HAMBURGUESAS ---
  await createProduct('Chili Burger', catHamburguesas, [
    'Pan', 'Salsa', 'Ripio', 'Chili Burger', 'Guacamole', 
    'Carne con mozzarella', 'Tocineta', 'Carne con mozzarella', 
    'BBQ', 'Pepinillos', 'Salsa de la casa'
  ], ['Pan', 'Salsa', 'Ripio', 'Chili Burger', 'Guacamole', 'Carne', 'Queso Mozzarella', 'Tocineta', 'BBQ', 'Pepinillos', 'Salsa de la casa'])

  await createProduct('Chicago Burger', catHamburguesas, [
    'Base normal', 'Carne con cheddar y jamón', 'Carne con cheddar y tocineta',
    'BBQ', 'Pepinillos', 'Salsa de la casa'
  ], ['Base normal', 'Carne', 'Queso Cheddar', 'Jamón', 'Tocineta', 'BBQ', 'Pepinillos', 'Salsa de la casa'])

  // --- HOT DOGS ---
  await createProduct('Colombiano', catHotDogs, [
    'Pan', 'Salsa', 'Salchicha', 'Queso en dos partes y al microondas',
    'Piña caramelizada', 'Cebolla', 'Tocineta', 'Tomate', 'Mostaza',
    'Piña', 'Salsa de la casa', 'Ripio'
  ], ['Pan', 'Salsa', 'Salchicha', 'Queso', 'Piña caramelizada', 'Cebolla', 'Tocineta', 'Tomate', 'Mostaza', 'Piña', 'Salsa de la casa', 'Ripio'])

  console.log('Seed terminado')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
