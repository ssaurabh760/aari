import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// PATCH /api/replies/:id
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { content } = body

    const reply = await prisma.reply.update({
      where: { id },
      data: { content },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
      },
    })

    return NextResponse.json({ data: reply })
  } catch (error) {
    console.error('Failed to update reply:', error)
    return NextResponse.json(
      { error: 'Failed to update reply' },
      { status: 500 }
    )
  }
}

// DELETE /api/replies/:id
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.reply.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete reply:', error)
    return NextResponse.json(
      { error: 'Failed to delete reply' },
      { status: 500 }
    )
  }
}