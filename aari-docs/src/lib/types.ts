export interface User {
  id: string
  name: string | null
  email: string
  image?: string | null
  avatarUrl?: string | null
  createdAt: Date | string
}

export interface Document {
  id: string
  title: string
  content: string | object
  createdAt: Date | string
  updatedAt: Date | string
}

export interface Reply {
  id: string
  content: string
  createdAt: Date | string
  updatedAt: Date | string
  commentId: string
  userId: string
  user?: User
}

export interface Comment {
  id: string
  content: string
  highlightedText: string
  selectionFrom: number
  selectionTo: number
  isResolved: boolean
  createdAt: Date | string
  updatedAt: Date | string
  documentId: string
  userId: string
  user?: User
  replies?: Reply[]
}