import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/middleware'

// GET /api/orders - get user's orders
export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(orders)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/orders - place a new order
export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { address, city, phone, items } = await request.json()

    if (!address || !city || !phone || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate products and calculate total
    let total = 0
    const orderItems: { productId: number; quantity: number; price: number }[] = []
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.id } })
      if (!product) {
        return NextResponse.json({ error: `Product ${item.id} not found` }, { status: 404 })
      }
      if (product.stock < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${product.name}` }, { status: 400 })
      }
      total += product.price * item.quantity
      orderItems.push({ productId: product.id, quantity: item.quantity, price: product.price })
    }

    // Create order and update stock
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          address,
          city,
          phone,
          total,
          items: { create: orderItems },
        },
        include: { items: { include: { product: true } } },
      })
      // Update stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.id },
          data: { stock: { decrement: item.quantity } },
        })
      }
      return newOrder
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
