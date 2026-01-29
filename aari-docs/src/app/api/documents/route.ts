import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/documents - List all documents
export async function GET() {
  try {
    const documents = await prisma.document.findMany({
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { comments: true },
        },
      },
    })

    return NextResponse.json({ data: documents })
  } catch (error) {
    console.error('Failed to fetch documents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    )
  }
}

// POST /api/documents - Create new document
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, content } = body

    const document = await prisma.document.create({
      data: {
        title: title || 'Untitled',
        content: content || { type: 'doc', content: [] },
      },
    })

    return NextResponse.json({ data: document }, { status: 201 })
  } catch (error) {
    console.error('Failed to create document:', error)
    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    )
  }
}