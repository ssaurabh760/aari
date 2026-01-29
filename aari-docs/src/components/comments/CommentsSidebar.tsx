'use client'

import { useState } from 'react'
import { CommentForm } from './CommentForm'
import { CommentThread } from './CommentThread'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageSquare } from 'lucide-react'
import { Comment } from '@/lib/types'
import { TextSelection } from '@/components/editor'

interface CommentsSidebarProps {
  comments: Comment[]
  selectedText: TextSelection | null
  activeCommentId: string | null
  onCommentClick: (commentId: string) => void
  onAddComment: (
    content: string,
    highlightedText: string,
    selectionFrom: number,
    selectionTo: number
  ) => Promise<void>
  onCancelComment: () => void
  onResolve: (commentId: string, isResolved: boolean) => Promise<void>
  onDelete: (commentId: string) => Promise<void>
  onEdit: (commentId: string, content: string) => Promise<void>
  onReply: (commentId: string, content: string) => Promise<void>
  onDeleteReply: (replyId: string) => Promise<void>
  onEditReply: (replyId: string, content: string) => Promise<void>
}

type FilterType = 'all' | 'open' | 'resolved'

export function CommentsSidebar({
  comments,
  selectedText,
  activeCommentId,
  onCommentClick,
  onAddComment,
  onCancelComment,
  onResolve,
  onDelete,
  onEdit,
  onReply,
  onDeleteReply,
  onEditReply,
}: CommentsSidebarProps) {
  const [filter, setFilter] = useState<FilterType>('all')
  const [isAddingComment, setIsAddingComment] = useState(false)

  const filteredComments = comments.filter((c) => {
    if (filter === 'open') return !c.isResolved
    if (filter === 'resolved') return c.isResolved
    return true
  })

  const openCount = comments.filter((c) => !c.isResolved).length
  const resolvedCount = comments.filter((c) => c.isResolved).length

  const handleAddComment = async (content: string) => {
    if (!selectedText) return
    await onAddComment(
      content,
      selectedText.text,
      selectedText.from,
      selectedText.to
    )
    setIsAddingComment(false)
    onCancelComment()
  }

  return (
    <aside className="w-80 border-l bg-gray-50 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="h-5 w-5 text-gray-600" />
          <h2 className="font-semibold text-gray-800">Comments</h2>
          <span className="text-sm text-gray-500">({comments.length})</span>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          <FilterButton
            active={filter === 'all'}
            onClick={() => setFilter('all')}
          >
            All
          </FilterButton>
          <FilterButton
            active={filter === 'open'}
            onClick={() => setFilter('open')}
          >
            Open ({openCount})
          </FilterButton>
          <FilterButton
            active={filter === 'resolved'}
            onClick={() => setFilter('resolved')}
          >
            Resolved ({resolvedCount})
          </FilterButton>
        </div>
      </div>

      {/* New Comment Form */}
      {selectedText && (
        <div className="p-4 border-b bg-blue-50/50">
          {isAddingComment ? (
            <CommentForm
              highlightedText={selectedText.text}
              onSubmit={handleAddComment}
              onCancel={() => {
                setIsAddingComment(false)
                onCancelComment()
              }}
            />
          ) : (
            <div className="bg-white rounded-lg border p-3">
              <p className="text-xs text-gray-500 mb-1">Selected text:</p>
              <p className="text-sm bg-yellow-100 px-2 py-1 rounded mb-3 line-clamp-2">
                "{selectedText.text}"
              </p>
              <Button
                className="w-full"
                size="sm"
                onClick={() => setIsAddingComment(true)}
              >
                Add Comment
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Comments List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {filteredComments.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">
                {filter === 'all'
                  ? 'No comments yet.'
                  : filter === 'open'
                  ? 'No open comments.'
                  : 'No resolved comments.'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Select text in the editor to add a comment.
              </p>
            </div>
          ) : (
            filteredComments.map((comment) => (
              <CommentThread
                key={comment.id}
                comment={comment}
                isActive={activeCommentId === comment.id}
                onClick={() => onCommentClick(comment.id)}
                onResolve={onResolve}
                onDelete={onDelete}
                onEdit={onEdit}
                onReply={onReply}
                onDeleteReply={onDeleteReply}
                onEditReply={onEditReply}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </aside>
  )
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 text-xs py-1.5 px-2 rounded-md transition-colors ${
        active
          ? 'bg-white text-gray-800 shadow-sm font-medium'
          : 'text-gray-600 hover:text-gray-800'
      }`}
    >
      {children}
    </button>
  )
}