import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/middleware'

// GET /api/admin/products
export async function GET(request: NextRequest) {
  const user = requireAdmin(request)
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(products)
}

// POST /api/admin/products
export async function POST(request: NextRequest) {
  const user = requireAdmin(request)
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const data = await request.json()
    const { name, description, price, stock, image, careLevel, light, water, featured, categoryId } = data

    if (!name || !description || !price || !categoryId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now()

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        stock: parseInt(stock) || 0,
        image: image || null,
        careLevel: careLevel || 'Easy',
        light: light || 'Indirect',
        water: water || 'Weekly',
        featured: featured || false,
        categoryId: parseInt(categoryId),
      },
      include: { category: true },
    })
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
