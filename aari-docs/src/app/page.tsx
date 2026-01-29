'use client'

import { useState } from 'react'
import { Editor, TextSelection } from '@/components/editor'

export default function Home() {
  const [content, setContent] = useState('<p>Hello! Start typing here...</p>')
  const [selection, setSelection] = useState<TextSelection | null>(null)

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">AARI Docs</h1>
      </header>

      <div className="flex h-[calc(100vh-65px)]">
        {/* Editor Area */}
        <div className="flex-1 border-r">
          <Editor
            content={content}
            onUpdate={setContent}
            onSelectionChange={setSelection}
          />
        </div>

        {/* Comments Sidebar (placeholder) */}
        <aside className="w-80 bg-gray-50 p-4">
          <h2 className="font-semibold text-gray-700 mb-4">Comments</h2>
          
          {selection ? (
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <p className="text-sm text-gray-500 mb-2">Selected text:</p>
              <p className="text-sm font-medium bg-yellow-100 p-2 rounded">
                "{selection.text}"
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Position: {selection.from} - {selection.to}
              </p>
              <button className="mt-3 w-full bg-blue-600 text-white text-sm py-2 px-4 rounded-md hover:bg-blue-700 transition">
                Add Comment
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Select text in the editor to add a comment.
            </p>
          )}
        </aside>
      </div>
    </main>
  )
}