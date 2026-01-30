import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/documents - Get ALL documents (visible to all authenticated users)
export async function GET() {
  try {
    const documents = await prisma.document.findMany({
      orderBy: { updatedAt: 'desc' },
      // No user filter - all documents visible to everyone
    })

    return NextResponse.json({ data: documents })
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    )
  }
}

// POST /api/documents - Create a new document
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
    console.error('Error creating document:', error)
    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    )
  }
}