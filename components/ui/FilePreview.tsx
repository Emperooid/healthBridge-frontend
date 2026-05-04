'use client'

import { useState } from 'react'
import { formatFileSize } from '@/utils/format'
import type { MedicalAttachment } from '@/types'

interface FilePreviewProps {
  attachment: MedicalAttachment
  onDelete?: (id: string) => void
}

export function FilePreview({ attachment, onDelete }: FilePreviewProps) {
  const [previewOpen, setPreviewOpen] = useState(false)
  const isPdf = attachment.type === 'application/pdf'
  const isImage = attachment.type.startsWith('image/')

  return (
    <>
      <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200">
          {isImage ? (
            <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          ) : isPdf ? (
            <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ) : (
            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium text-slate-900">{attachment.name}</p>
          <p className="text-xs text-slate-500">{formatFileSize(attachment.size)}</p>
        </div>
        <div className="flex items-center gap-1">
          {(isImage || isPdf) && (
            <button
              onClick={() => setPreviewOpen(true)}
              className="rounded p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
              title="Preview"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          )}
          <a
            href={attachment.url}
            download={attachment.name}
            className="rounded p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
            title="Download"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </a>
          {onDelete && (
            <button
              onClick={() => onDelete(attachment.id)}
              className="rounded p-1.5 text-slate-400 hover:bg-red-100 hover:text-red-600 transition-colors"
              title="Delete"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {previewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setPreviewOpen(false)}
        >
          <div
            className="relative max-h-[90vh] max-w-4xl w-full overflow-auto rounded-xl bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <span className="text-sm font-medium text-slate-900">{attachment.name}</span>
              <button
                onClick={() => setPreviewOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              {isImage && (
                <img src={attachment.url} alt={attachment.name} className="mx-auto max-h-[70vh] object-contain" />
              )}
              {isPdf && (
                <iframe src={attachment.url} title={attachment.name} className="h-[70vh] w-full rounded" />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
