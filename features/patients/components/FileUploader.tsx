'use client'

import { useCallback, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { formatFileSize } from '@/utils/format'

interface FileUploaderProps {
  onUpload: (files: File[]) => Promise<void>
  accept?: string
  maxSize?: number
  multiple?: boolean
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

export function FileUploader({
  onUpload,
  accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx',
  maxSize = MAX_FILE_SIZE,
  multiple = true,
}: FileUploaderProps) {
  const [dragOver, setDragOver] = useState(false)
  const [staged, setStaged] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const validate = useCallback(
    (files: File[]) => {
      const errs: string[] = []
      files.forEach((f) => {
        if (f.size > maxSize) errs.push(`${f.name} exceeds ${formatFileSize(maxSize)} limit`)
      })
      return errs
    },
    [maxSize]
  )

  const stage = useCallback(
    (files: File[]) => {
      const errs = validate(files)
      setErrors(errs)
      if (errs.length === 0) setStaged((prev) => (multiple ? [...prev, ...files] : files))
    },
    [validate, multiple]
  )

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    stage(Array.from(e.dataTransfer.files))
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) stage(Array.from(e.target.files))
  }

  const remove = (idx: number) => setStaged((prev) => prev.filter((_, i) => i !== idx))

  const handleUpload = async () => {
    if (!staged.length) return
    setUploading(true)
    try {
      await onUpload(staged)
      setStaged([])
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <label
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 transition-colors ${
          dragOver ? 'border-blue-400 bg-blue-50' : 'border-slate-300 bg-slate-50 hover:border-slate-400'
        }`}
      >
        <input
          type="file"
          className="sr-only"
          accept={accept}
          multiple={multiple}
          onChange={handleInput}
        />
        <svg className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <div className="text-center">
          <p className="text-sm font-medium text-slate-700">Drop files here or click to browse</p>
          <p className="mt-1 text-xs text-slate-500">
            {accept.replace(/\./g, '').toUpperCase().replace(/,/g, ', ')} up to {formatFileSize(maxSize)}
          </p>
        </div>
      </label>

      {errors.map((err) => (
        <p key={err} className="text-sm text-red-600">{err}</p>
      ))}

      {staged.length > 0 && (
        <div className="space-y-2">
          {staged.map((file, idx) => (
            <div key={idx} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3">
              <svg className="h-5 w-5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-slate-900">{file.name}</p>
                <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
              </div>
              <button
                onClick={() => remove(idx)}
                className="rounded p-1 text-slate-400 hover:text-red-500 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          <Button onClick={handleUpload} loading={uploading} className="w-full">
            Upload {staged.length} file{staged.length > 1 ? 's' : ''}
          </Button>
        </div>
      )}
    </div>
  )
}
