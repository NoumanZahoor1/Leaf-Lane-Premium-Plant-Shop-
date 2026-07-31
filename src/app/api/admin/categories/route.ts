import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/middleware'

// GET /api/admin/categories
export async function GET(request: NextRequest) {
  const user = requireAdmin(request)
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
  })
  return NextResponse.json(categories)
}

// POST /api/admin/categories
export async function POST(request: NextRequest) {
  const user = requireAdmin(request)
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const { name, image } = await request.json()
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const category = await prisma.category.create({
      data: { name, slug, image: image || null },
    })
    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Category already exists or error occurred' }, { status: 500 })
  }
}

// DELETE /api/admin/categories
export async function DELETE(request: NextRequest) {
  const user = requireAdmin(request)
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const { id } = await request.json()
    await prisma.category.delete({ where: { id: parseInt(id) } })
    return NextResponse.json({ message: 'Category deleted' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
