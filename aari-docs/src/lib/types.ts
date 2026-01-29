export interface User {
  id: string
  name: string
  email: string
  avatarUrl: string | null
}

export interface Reply {
  id: string
  commentId: string
  userId: string
  user: User
  content: string
  createdAt: Date
  updatedAt: Date
}

export interface Comment {
  id: string
  documentId: string
  userId: string
  user: User
  highlightedText: string
  selectionFrom: number
  selectionTo: number
  content: string
  isResolved: boolean
  replies: Reply[]
  createdAt: Date
  updatedAt: Date
}

export interface Document {
  id: string
  title: string
  content: unknown
  comments: Comment[]
  createdAt: Date
  updatedAt: Date
}