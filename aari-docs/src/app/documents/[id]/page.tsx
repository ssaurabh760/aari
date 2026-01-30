'use client'

import { useState, useEffect, useCallback, use, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Editor, TextSelection, CommentMark } from '@/components/editor'
import { CommentsSidebar } from '@/components/comments'
import { useDocument, useComments } from '@/lib/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Loader2, Save, Check } from 'lucide-react'
import { toast } from 'sonner'
import { UserMenu } from '@/components/UserMenu'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function DocumentPage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()
  const { data: session, status: sessionStatus } = useSession()
  
  const {
    document: doc,
    isLoading: docLoading,
    updateDocument,
  } = useDocument(id)
  const {
    comments,
    addComment,
    updateComment,
    deleteComment,
    resolveComment,
    addReply,
    updateReply,
    deleteReply,
  } = useComments(id)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState<string | object>('')
  const [selectedText, setSelectedText] = useState<TextSelection | null>(null)
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Get current user ID from session
  const currentUserId = session?.user?.id || ''

  // Convert comments to marks for highlighting
  const commentMarks: CommentMark[] = useMemo(() => {
    return comments
      .filter((c) => !c.isResolved)
      .map((c) => ({
        id: c.id,
        from: c.selectionFrom,
        to: c.selectionTo,
      }))
  }, [comments])

  // Initialize content from document
  useEffect(() => {
    if (doc) {
      setTitle(doc.title)
      setContent(doc.content as string | object)
    }
  }, [doc])

  // Auto-save with debounce
  const saveDocument = useCallback(async () => {
    if (!doc) return
    setIsSaving(true)
    try {
      await updateDocument({ title, content })
      setLastSaved(new Date())
    } catch (error) {
      console.error('Failed to save:', error)
      toast.error('Failed to save document')
    } finally {
      setIsSaving(false)
    }
  }, [doc, title, content, updateDocument])

  // Debounced auto-save
  useEffect(() => {
    if (!doc) return
    const timer = setTimeout(() => {
      if (title !== doc.title || content) {
        saveDocument()
      }
    }, 5000)

    return () => clearTimeout(timer)
  }, [title, content, doc, saveDocument])

  // Comment handlers
  const handleAddComment = async (
    commentContent: string,
    highlightedText: string,
    selectionFrom: number,
    selectionTo: number
  ) => {
    if (!currentUserId) {
      toast.error('You must be signed in to comment')
      return
    }
    try {
      await addComment(
        commentContent,
        highlightedText,
        selectionFrom,
        selectionTo,
        currentUserId
      )
      setSelectedText(null)
      toast.success('Comment added')
    } catch {
      toast.error('Failed to add comment')
    }
  }

  const handleReply = async (commentId: string, replyContent: string) => {
    if (!currentUserId) {
      toast.error('You must be signed in to reply')
      return
    }
    try {
      await addReply(commentId, replyContent, currentUserId)
      toast.success('Reply added')
    } catch {
      toast.error('Failed to add reply')
    }
  }

  const handleResolve = async (commentId: string, isResolved: boolean) => {
    try {
      await resolveComment(commentId, isResolved)
      toast.success(isResolved ? 'Comment resolved' : 'Comment reopened')
    } catch {
      toast.error('Failed to update comment')
    }
  }

  const handleDelete = async (commentId: string) => {
    try {
      await deleteComment(commentId)
      toast.success('Comment deleted')
      if (activeCommentId === commentId) {
        setActiveCommentId(null)
      }
    } catch {
      toast.error('Failed to delete comment')
    }
  }

  const handleEdit = async (commentId: string, content: string) => {
    try {
      await updateComment(commentId, content)
      toast.success('Comment updated')
    } catch {
      toast.error('Failed to update comment')
    }
  }

  const handleDeleteReply = async (replyId: string) => {
    try {
      await deleteReply(replyId)
      toast.success('Reply deleted')
    } catch {
      toast.error('Failed to delete reply')
    }
  }

  const handleEditReply = async (replyId: string, content: string) => {
    try {
      await updateReply(replyId, content)
      toast.success('Reply updated')
    } catch {
      toast.error('Failed to update reply')
    }
  }

  const handleCommentClick = (commentId: string) => {
    setActiveCommentId(commentId)
    const commentElement = window.document.getElementById(`comment-${commentId}`)
    if (commentElement) {
      commentElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const handleEditorCommentClick = (commentId: string) => {
    setActiveCommentId(commentId)
    const commentElement = window.document.getElementById(`comment-${commentId}`)
    if (commentElement) {
      commentElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  // Show loading while checking session
  if (sessionStatus === 'loading' || docLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!doc) {
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

        <div className="flex items-center gap-3">
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
          <UserMenu />
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
            onCommentClick={handleEditorCommentClick}
            commentMarks={commentMarks}
            activeCommentId={activeCommentId}
          />
        </div>

        {/* Comments Sidebar */}
        <CommentsSidebar
          comments={comments}
          selectedText={selectedText}
          activeCommentId={activeCommentId}
          currentUserId={currentUserId}
          onCommentClick={handleCommentClick}
          onAddComment={handleAddComment}
          onCancelComment={() => setSelectedText(null)}
          onResolve={handleResolve}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onReply={handleReply}
          onDeleteReply={handleDeleteReply}
          onEditReply={handleEditReply}
        />
      </div>
    </main>
  )
}