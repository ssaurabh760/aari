import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET /api/users - Get all users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      take: 20,
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json({ data: users })
  } catch (error) {
    console.error('Failed to fetch users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}