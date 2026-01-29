'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { X } from 'lucide-react'

interface CommentFormProps {
  highlightedText: string
  onSubmit: (content: string) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function CommentForm({
  highlightedText,
  onSubmit,
  onCancel,
  isLoading = false,
}: CommentFormProps) {
  const [content, setContent] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    await onSubmit(content)
    setContent('')
  }

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 mb-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-xs text-gray-500 mb-1">Commenting on:</p>
          <p className="text-sm bg-yellow-100 px-2 py-1 rounded border-l-2 border-yellow-400 line-clamp-2">
            "{highlightedText}"
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="h-6 w-6 p-0 ml-2"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add your comment..."
          className="min-h-[80px] mb-3 text-sm"
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={!content.trim() || isLoading}
          >
            {isLoading ? 'Adding...' : 'Comment'}
          </Button>
        </div>
      </form>
    </div>
  )
}