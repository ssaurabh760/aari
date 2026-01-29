import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/comments/:id/resolve
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { isResolved } = body

    const comment = await prisma.comment.update({
      where: { id },
      data: { isResolved: isResolved ?? true },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        replies: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatarUrl: true },
            },
          },
        },
      },
    })

    return NextResponse.json({ data: comment })
  } catch (error) {
    console.error('Failed to resolve comment:', error)
    return NextResponse.json(
      { error: 'Failed to resolve comment' },
      { status: 500 }
    )
  }
}