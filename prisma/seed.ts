import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@leaflane.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@leaflane.com',
      password: adminPassword,
      role: 'admin',
    },
  })

  // Create a test customer
  const customerPassword = await bcrypt.hash('customer123', 10)
  await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'john@example.com',
      password: customerPassword,
      role: 'customer',
    },
  })

  // Create categories
  const categories = [
    { name: 'Indoor Plants', slug: 'indoor-plants', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400' },
    { name: 'Outdoor Plants', slug: 'outdoor-plants', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400' },
    { name: 'Succulents', slug: 'succulents', image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400' },
    { name: 'Herbs', slug: 'herbs', image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400' },
    { name: 'Flowering Plants', slug: 'flowering-plants', image: 'https://images.unsplash.com/photo-1490750967868-88df5691cc71?w=400' },
    { name: 'Plant Care', slug: 'plant-care', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }

  const indoor = await prisma.category.findUnique({ where: { slug: 'indoor-plants' } })
  const succulents = await prisma.category.findUnique({ where: { slug: 'succulents' } })
  const herbs = await prisma.category.findUnique({ where: { slug: 'herbs' } })
  const flowering = await prisma.category.findUnique({ where: { slug: 'flowering-plants' } })
  const outdoor = await prisma.category.findUnique({ where: { slug: 'outdoor-plants' } })
  const care = await prisma.category.findUnique({ where: { slug: 'plant-care' } })

  // Create products
  const products = [
    {
      name: 'Monstera Deliciosa',
      slug: 'monstera-deliciosa',
      description: 'The iconic Monstera Deliciosa, also known as the Swiss Cheese Plant, is beloved for its large, glossy leaves with natural holes. Perfect for bringing a tropical feel to any room.',
      price: 34.99,
      stock: 25,
      image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600',
      careLevel: 'Easy',
      light: 'Indirect',
      water: 'Weekly',
      featured: true,
      categoryId: indoor!.id,
    },
    {
      name: 'Peace Lily',
      slug: 'peace-lily',
      description: 'The Peace Lily is one of the most popular houseplants, known for its beautiful white blooms and air-purifying qualities. It thrives in low light conditions.',
      price: 22.99,
      stock: 30,
      image: 'https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=600',
      careLevel: 'Easy',
      light: 'Low',
      water: 'Weekly',
      featured: true,
      categoryId: indoor!.id,
    },
    {
      name: 'Fiddle Leaf Fig',
      slug: 'fiddle-leaf-fig',
      description: 'The Fiddle Leaf Fig is an interior design favorite, featuring large violin-shaped leaves. It makes a dramatic statement in any living space.',
      price: 54.99,
      stock: 15,
      image: 'https://images.unsplash.com/photo-1611403570720-162d8829689a?w=600',
      careLevel: 'Hard',
      light: 'Bright',
      water: 'Weekly',
      featured: true,
      categoryId: indoor!.id,
    },
    {
      name: 'Snake Plant',
      slug: 'snake-plant',
      description: 'The Snake Plant (Sansevieria) is virtually indestructible. It purifies air, tolerates low light, and requires very little water — perfect for beginners.',
      price: 19.99,
      stock: 40,
      image: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=600',
      careLevel: 'Easy',
      light: 'Low',
      water: 'Biweekly',
      featured: true,
      categoryId: indoor!.id,
    },
    {
      name: 'Aloe Vera',
      slug: 'aloe-vera',
      description: 'Aloe Vera is a succulent plant known for its medicinal properties. The gel inside the leaves soothes burns and skin irritation. Extremely easy to care for.',
      price: 14.99,
      stock: 50,
      image: 'https://images.unsplash.com/photo-1567748157439-651aca2ff064?w=600',
      careLevel: 'Easy',
      light: 'Bright',
      water: 'Biweekly',
      featured: false,
      categoryId: succulents!.id,
    },
    {
      name: 'Echeveria Collection',
      slug: 'echeveria-collection',
      description: 'A beautiful set of 3 Echeveria succulents in pastel shades of pink, purple, and blue. These rosette-shaped succulents are perfect for windowsills and desk arrangements.',
      price: 24.99,
      stock: 20,
      image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600',
      careLevel: 'Easy',
      light: 'Bright',
      water: 'Biweekly',
      featured: true,
      categoryId: succulents!.id,
    },
    {
      name: 'Basil Plant',
      slug: 'basil-plant',
      description: 'Fresh organic basil plant ready to harvest. Grow your own fresh herbs in your kitchen or garden. Adds amazing flavor to pasta, pizza, and salads.',
      price: 8.99,
      stock: 60,
      image: 'https://images.unsplash.com/photo-1466843583516-6cae1c0e6ca7?w=600',
      careLevel: 'Medium',
      light: 'Bright',
      water: 'Daily',
      featured: false,
      categoryId: herbs!.id,
    },
    {
      name: 'Lavender',
      slug: 'lavender',
      description: 'Beautiful aromatic lavender plant with stunning purple flower spikes. Known for its calming fragrance, lavender is perfect for bedrooms and patios.',
      price: 12.99,
      stock: 35,
      image: 'https://images.unsplash.com/photo-1471086569966-db3eebc25a59?w=600',
      careLevel: 'Medium',
      light: 'Bright',
      water: 'Weekly',
      featured: false,
      categoryId: herbs!.id,
    },
    {
      name: 'Orchid',
      slug: 'orchid',
      description: 'Elegant Phalaenopsis orchid with stunning blooms that last for months. Available in white and purple varieties. A luxurious gift for any occasion.',
      price: 44.99,
      stock: 18,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600',
      careLevel: 'Medium',
      light: 'Indirect',
      water: 'Weekly',
      featured: true,
      categoryId: flowering!.id,
    },
    {
      name: 'Pothos Golden',
      slug: 'pothos-golden',
      description: 'The Golden Pothos is one of the easiest plants to grow. Its heart-shaped leaves trail beautifully from shelves or hanging baskets. Excellent air purifier.',
      price: 16.99,
      stock: 45,
      image: 'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=600',
      careLevel: 'Easy',
      light: 'Low',
      water: 'Weekly',
      featured: false,
      categoryId: indoor!.id,
    },
    {
      name: 'Bird of Paradise',
      slug: 'bird-of-paradise',
      description: 'A striking tropical plant that can grow up to 6 feet tall indoors. The large paddle-shaped leaves add instant drama and sophistication to any space.',
      price: 79.99,
      stock: 10,
      image: 'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?w=600',
      careLevel: 'Medium',
      light: 'Bright',
      water: 'Weekly',
      featured: true,
      categoryId: outdoor!.id,
    },
    {
      name: 'Premium Potting Mix',
      slug: 'premium-potting-mix',
      description: 'Professional-grade all-purpose potting mix enriched with perlite and slow-release fertilizer. Provides excellent drainage and aeration for healthy root growth.',
      price: 18.99,
      stock: 100,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
      careLevel: 'Easy',
      light: 'Low',
      water: 'Weekly',
      featured: false,
      categoryId: care!.id,
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
  }

  console.log('✅ Database seeded successfully!')
  console.log('Admin login: admin@leaflane.com / admin123')
  console.log('Customer login: john@example.com / customer123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
