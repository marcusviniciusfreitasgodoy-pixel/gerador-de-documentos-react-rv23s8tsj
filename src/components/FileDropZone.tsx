import { useRef, useState, useCallback } from 'react'
import { Upload, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileDropZoneProps {
  onFileSelect?: (file: File) => void
  onFilesSelect?: (files: File[]) => void
  multiple?: boolean
  selectedFiles?: File[]
  disabled?: boolean
  loading?: boolean
  loadingText?: string
}

const ACCEPTED_MIME =
  '.pdf,.png,.jpg,.jpeg,.docx,application/pdf,image/png,image/jpeg,application/vnd.openxmlformats-officedocument.wordprocessingml.document'

export function FileDropZone({
  onFileSelect,
  onFilesSelect,
  multiple = false,
  selectedFiles,
  disabled = false,
  loading = false,
  loadingText = 'Processando...',
}: FileDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (disabled || loading) return
      if (multiple) {
        const dropped = Array.from(e.dataTransfer.files || [])
        if (dropped.length) onFilesSelect?.(dropped)
      } else {
        const file = e.dataTransfer.files?.[0]
        if (file) onFileSelect?.(file)
      }
    },
    [disabled, loading, multiple, onFileSelect, onFilesSelect],
  )

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      if (!disabled && !loading) setIsDragging(true)
    },
    [disabled, loading],
  )

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleClick = useCallback(() => {
    if (!disabled && !loading) inputRef.current?.click()
  }, [disabled, loading])

  const fileCount = selectedFiles?.length || 0

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleClick()
      }}
      className={cn(
        'relative flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors',
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50 hover:bg-secondary/30',
        (disabled || loading) && 'opacity-60 cursor-not-allowed pointer-events-none',
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_MIME}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          if (multiple) {
            const selected = Array.from(e.target.files || [])
            if (selected.length) onFilesSelect?.(selected)
          } else {
            const file = e.target.files?.[0]
            if (file) onFileSelect?.(file)
          }
          e.target.value = ''
        }}
      />
      {loading ? (
        <>
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground font-medium">{loadingText}</p>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 text-primary">
            <Upload className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium text-foreground text-center">
            {multiple
              ? 'Arraste arquivos ou clique para selecionar'
              : 'Arraste um arquivo ou clique para selecionar'}
          </p>
          <p className="text-xs text-muted-foreground text-center">
            Formatos suportados: PDF, PNG, JPG, DOCX
          </p>
          {multiple && fileCount > 0 && (
            <p className="text-xs font-medium text-primary text-center">
              {fileCount} {fileCount === 1 ? 'arquivo selecionado' : 'arquivos selecionados'}
            </p>
          )}
        </>
      )}
    </div>
  )
}
