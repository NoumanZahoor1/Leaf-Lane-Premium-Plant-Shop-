import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/middleware'

// GET /api/admin/dashboard
export async function GET(request: NextRequest) {
  const user = requireAdmin(request)
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const [totalProducts, totalOrders, totalUsers, recentOrders, totalRevenue] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { not: 'cancelled' } },
    }),
  ])

  return NextResponse.json({
    totalProducts,
    totalOrders,
    totalUsers,
    recentOrders,
    totalRevenue: totalRevenue._sum.total || 0,
  })
}
