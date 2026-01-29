import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/documents/:id/comments
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const comments = await prisma.comment.findMany({
      where: { documentId: id },
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
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ data: comments })
  } catch (error) {
    console.error('Failed to fetch comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

// POST /api/documents/:id/comments
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { userId, content, highlightedText, selectionFrom, selectionTo } = body

    if (!userId || !content || !highlightedText) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const comment = await prisma.comment.create({
      data: {
        documentId: id,
        userId,
        content,
        highlightedText,
        selectionFrom: selectionFrom || 0,
        selectionTo: selectionTo || 0,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        replies: true,
      },
    })

    return NextResponse.json({ data: comment }, { status: 201 })
  } catch (error) {
    console.error('Failed to create comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}