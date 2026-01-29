'use client'

import { useState, useEffect, useCallback, use } from 'react'
import { useRouter } from 'next/navigation'
import { Editor, TextSelection } from '@/components/editor'
import { CommentsSidebar } from '@/components/comments'
import { useDocument, useComments } from '@/lib/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Loader2, Save, Check } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function DocumentPage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()
  const { document, isLoading: docLoading, updateDocument } = useDocument(id)
  const {
    comments,
    isLoading: commentsLoading,
    addComment,
    updateComment,
    deleteComment,
    resolveComment,
    addReply,
    updateReply,
    deleteReply,
  } = useComments(id)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedText, setSelectedText] = useState<TextSelection | null>(null)
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string>('')

  // Fetch a user ID to use (first user from the database)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/users')
        if (res.ok) {
          const { data } = await res.json()
          if (data && data.length > 0) {
            setCurrentUserId(data[0].id)
          }
        }
      } catch (error) {
        console.error('Failed to fetch user:', error)
      }
    }
    fetchUser()
  }, [])

  // Initialize content from document
  useEffect(() => {
    if (document) {
      setTitle(document.title)
      // Convert JSON content to HTML for TipTap
      if (typeof document.content === 'string') {
        setContent(document.content)
      } else {
        // If it's JSON, we'll pass it directly
        setContent(JSON.stringify(document.content))
      }
    }
  }, [document])

  // Auto-save with debounce
  const saveDocument = useCallback(async () => {
    if (!document) return
    setIsSaving(true)
    try {
      await updateDocument({ title, content })
      setLastSaved(new Date())
    } catch (error) {
      console.error('Failed to save:', error)
    } finally {
      setIsSaving(false)
    }
  }, [document, title, content, updateDocument])

  // Debounced auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      if (document && (title !== document.title || content)) {
        saveDocument()
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [title, content, document, saveDocument])

  // Comment handlers
  const handleAddComment = async (
    commentContent: string,
    highlightedText: string,
    selectionFrom: number,
    selectionTo: number
  ) => {
    if (!currentUserId) {
      alert('No user available. Please run the seed script first.')
      return
    }
    await addComment(commentContent, highlightedText, selectionFrom, selectionTo, currentUserId)
    setSelectedText(null)
  }

  const handleReply = async (commentId: string, replyContent: string) => {
    if (!currentUserId) return
    await addReply(commentId, replyContent, currentUserId)
  }

  if (docLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!document) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Document not found</p>
          <Button onClick={() => router.push('/')}>Go Home</Button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b px-4 py-3 flex items-center justify-between bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-semibold border-none shadow-none focus-visible:ring-0 w-[300px]"
            placeholder="Untitled"
          />
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-500">
          {isSaving ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </span>
          ) : lastSaved ? (
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              Saved
            </span>
          ) : null}
          <Button size="sm" onClick={saveDocument} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor */}
        <div className="flex-1 overflow-y-auto">
          <Editor
            content={content}
            onUpdate={setContent}
            onSelectionChange={setSelectedText}
          />
        </div>

        {/* Comments Sidebar */}
        <CommentsSidebar
          comments={comments}
          selectedText={selectedText}
          activeCommentId={activeCommentId}
          onCommentClick={setActiveCommentId}
          onAddComment={handleAddComment}
          onCancelComment={() => setSelectedText(null)}
          onResolve={resolveComment}
          onDelete={deleteComment}
          onEdit={updateComment}
          onReply={handleReply}
          onDeleteReply={deleteReply}
          onEditReply={updateReply}
        />
      </div>
    </main>
  )
}